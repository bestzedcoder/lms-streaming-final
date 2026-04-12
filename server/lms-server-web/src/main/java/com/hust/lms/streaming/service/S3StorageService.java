package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.upload.MultipartCompleteRequest;
import com.hust.lms.streaming.dto.request.upload.MultipartInitRequest;
import com.hust.lms.streaming.dto.request.upload.MultipartInitResponse;
import com.hust.lms.streaming.dto.request.upload.ResourceCreatingRequest;
import com.hust.lms.streaming.dto.request.upload.ResourcePreviewResponse;
import com.hust.lms.streaming.dto.request.upload.ResourceUpdatingRequest;
import com.hust.lms.streaming.dto.request.upload.UploadFileResponse;
import com.hust.lms.streaming.dto.request.upload.VideoCreatingRequest;
import com.hust.lms.streaming.dto.request.upload.VideoUpdatingRequest;
import com.hust.lms.streaming.dto.response.resource.InstructorLectureResponse;
import com.hust.lms.streaming.dto.response.resource.InstructorVideoResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

public interface S3StorageService {
  UploadFileResponse requestUploadLecture(String fileName);
  MultipartInitResponse initMultipartVideo(MultipartInitRequest req);
  void completeMultipartVideo(MultipartCompleteRequest req);

  void createVideoRecord(VideoCreatingRequest request);
  void createResourceRecord(ResourceCreatingRequest request);
  void updateResourceRecord(ResourceUpdatingRequest request);
  void updateVideoRecord(VideoUpdatingRequest request, MultipartFile image);

  List<InstructorLectureResponse> getInstructorLectureList();
  List<InstructorVideoResponse> getInstructorVideoList();

  ResourcePreviewResponse generateVideoPreviewUrl(UUID videoId);
  ResourcePreviewResponse generateLecturePreviewUrl(UUID lectureId);
}
