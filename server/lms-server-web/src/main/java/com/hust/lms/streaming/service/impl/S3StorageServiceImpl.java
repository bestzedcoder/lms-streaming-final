package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.configuration.CustomMinioClient;
import com.hust.lms.streaming.dto.request.upload.MultipartCompleteRequest;
import com.hust.lms.streaming.dto.request.upload.MultipartInitRequest;
import com.hust.lms.streaming.dto.request.upload.MultipartInitResponse;
import com.hust.lms.streaming.dto.request.upload.ResourcePreviewResponse;
import com.hust.lms.streaming.dto.request.upload.UploadFileResponse;
import com.hust.lms.streaming.dto.response.resource.InstructorLectureResponse;
import com.hust.lms.streaming.dto.response.resource.InstructorVideoResponse;
import com.hust.lms.streaming.enums.VideoStatus;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.ResourceMapper;
import com.hust.lms.streaming.model.Resource;
import com.hust.lms.streaming.model.Video;
import com.hust.lms.streaming.repository.jpa.ResourceRepository;
import com.hust.lms.streaming.repository.jpa.VideoRepository;
import com.hust.lms.streaming.service.PathProvider;
import com.hust.lms.streaming.service.S3StorageService;
import io.minio.DownloadObjectArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import io.minio.messages.Part;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class S3StorageServiceImpl implements S3StorageService {

  private final PathProvider pathProvider;
  private final MinioClient minioClient;
  private final CustomMinioClient customMinioClient;
  private final VideoRepository videoRepository;
  private final ResourceRepository resourceRepository;

  @Value("${app.storage.s3.bucket-staging}")
  private String STAGING_BUCKET;

  @Override
  public UploadFileResponse requestUploadLecture(String fileName) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    String targetPath = pathProvider.getResourcePath(authId, fileName.trim());

    try {
      String presignedUrl = minioClient.getPresignedObjectUrl(
          GetPresignedObjectUrlArgs.builder()
              .method(Method.PUT)
              .bucket(STAGING_BUCKET)
              .object(targetPath)
              .expiry(5, TimeUnit.MINUTES)
              .build()
      );
      return UploadFileResponse.builder()
          .fileKey(targetPath)
          .presignedUrl(presignedUrl)
          .build();
    } catch (Exception e) {
      throw new RuntimeException("Không thể tạo URL upload tài liệu", e);
    }
  }

  @Override
  public MultipartInitResponse initMultipartVideo(MultipartInitRequest req) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    String targetPath = pathProvider.getVideoPath(authId, req.getFileName().trim());

    try {
      var response = customMinioClient.createMultipartUploadPublic(
              STAGING_BUCKET,
          null,
          targetPath,
          null,
          null
      ).get();

      String uploadId = response.result().uploadId();

      List<String> urls = new ArrayList<>();
      for (int i = 1; i <= req.getTotalParts(); i++) {
        Map<String, String> queryParams = new HashMap<>();
        queryParams.put("uploadId", uploadId);
        queryParams.put("partNumber", String.valueOf(i));

        urls.add(minioClient.getPresignedObjectUrl(
            GetPresignedObjectUrlArgs.builder()
                .method(Method.PUT)
                .bucket(STAGING_BUCKET)
                .object(targetPath)
                .expiry(10, TimeUnit.MINUTES)
                .extraQueryParams(queryParams)
                .build()
        ));
      }

      return MultipartInitResponse.builder()
          .uploadId(uploadId)
          .fileKey(targetPath)
          .presignedUrls(urls)
          .build();
    } catch (Exception e) {
      throw new RuntimeException("Lỗi khởi tạo upload video: " + e.getMessage(), e);
    }
  }

  @Override
  public void completeMultipartVideo(MultipartCompleteRequest req) {
    try {
      Part[] parts = new Part[req.getParts().size()];
      for (int i = 0; i < req.getParts().size(); i++) {
        var p = req.getParts().get(i);
        parts[i] = new Part(p.getPartNumber(), p.getETag());
      }

      customMinioClient.completeMultipartUploadPublic(
              STAGING_BUCKET,
          null,
          req.getFileKey(),
          req.getUploadId(),
          parts,
          null,
          null
      ).get();

    } catch (Exception e) {
      throw new RuntimeException("Lỗi ghép file video: " + e.getMessage(), e);
    }
  }

  @Override
  public List<InstructorLectureResponse> getInstructorLectureList() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    List<Resource> data = this.resourceRepository.findAllByOwner(UUID.fromString(authId));
    return data.stream().map(ResourceMapper::mapLectureToInstructorLectureResponse).toList();
  }

  @Override
  public List<InstructorVideoResponse> getInstructorVideoList() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    List<Video> data = this.videoRepository.findAllByOwner(UUID.fromString(authId));
    return data.stream().map(ResourceMapper::mapVideoToInstructorVideoResponse).toList();
  }

  @Override
  public ResourcePreviewResponse generateVideoPreviewUrl(UUID videoId) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Video video = this.videoRepository.findByOwner(UUID.fromString(authId), videoId).orElseThrow(() -> new BadRequestException("Video không thể truy cập"));

    try {
      String presignedUrl = minioClient.getPresignedObjectUrl(
          GetPresignedObjectUrlArgs.builder()
              .method(Method.GET)
              .bucket(STAGING_BUCKET)
              .object(video.getOriginalUrl())
              .expiry(15, TimeUnit.MINUTES)
              .build()
      );

      return ResourcePreviewResponse.builder()
          .url(presignedUrl)
          .title(video.getTitle())
          .build();

    } catch (Exception e) {
      throw new RuntimeException("Lỗi khi tạo link từ MinIO", e);
    }
  }

  @Override
  public ResourcePreviewResponse generateLecturePreviewUrl(UUID lectureId) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Resource resource = this.resourceRepository.findByOwner(UUID.fromString(authId), lectureId).orElseThrow(() -> new BadRequestException("Bài giảng không thể truy cập"));

    try {
      String presignedUrl = minioClient.getPresignedObjectUrl(
          GetPresignedObjectUrlArgs.builder()
              .method(Method.GET)
              .bucket(STAGING_BUCKET)
              .object(resource.getUrl())
              .expiry(15, TimeUnit.MINUTES)
              .build()
      );

      return ResourcePreviewResponse.builder()
          .url(presignedUrl)
          .title(resource.getTitle())
          .build();

    } catch (Exception e) {
      throw new RuntimeException("Lỗi khi tạo link từ MinIO", e);
    }
  }

  @Override
  public void handleVideoProcessingSuccess(UUID videoId, String hlsUrl) {
    Video video = this.videoRepository.findById(videoId).orElse(null);
    if (video == null) return;

    video.setStatus(VideoStatus.READY);
    video.setHlsUrl(hlsUrl);
    this.videoRepository.save(video);
  }

  @Override
  public void handleVideoProcessingFailure(UUID videoId) {
    Video video = this.videoRepository.findById(videoId).orElse(null);
    if (video == null) return;

    video.setStatus(VideoStatus.PENDING_REVIEW);
    this.videoRepository.save(video);
  }

  @Override
  public void download(String objectKey, String bucket, Path target) {
    try {
      minioClient.downloadObject(
              DownloadObjectArgs.builder()
                      .bucket(bucket)
                      .object(objectKey)
                      .filename(target.toAbsolutePath().toString())
                      .build()
      );

    } catch (Exception e) {
      log.error("Downloading file failed :", e);
      throw new RuntimeException("Cannot download object from MinIO: " + objectKey, e);
    }
  }

  @Override
  public void deleteFromStaging(String objectKey, String bucket) {
    try {
      minioClient.removeObject(
              RemoveObjectArgs.builder()
                      .bucket(bucket)
                      .object(objectKey)
                      .build()
      );
    } catch (Exception e) {
      log.error("Cannot delete invalid object from staging: {}", objectKey, e);
    }
  }
}