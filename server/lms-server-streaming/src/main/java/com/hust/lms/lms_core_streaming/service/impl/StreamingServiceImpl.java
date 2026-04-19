package com.hust.lms.lms_core_streaming.service.impl;

import com.hust.lms.lms_core_streaming.dto.VideoProcessingResultMessage;
import com.hust.lms.lms_core_streaming.enums.VideoProcessingResult;
import com.hust.lms.lms_core_streaming.queue.message.VideoProcessingMessage;
import com.hust.lms.lms_core_streaming.service.StreamingService;
import io.minio.DownloadObjectArgs;
import io.minio.MinioClient;
import io.minio.UploadObjectArgs;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StreamingServiceImpl implements StreamingService {

  @Value("${app.storage.s3.bucket-staging}")
  private String stagingBucket;

  @Value("${app.storage.s3.bucket-production}")
  private String productionBucket;

  @Value("${app.ffmpeg.bin:ffmpeg}")
  private String ffmpegBin;

  private final MinioClient minioClient;

  // xử lý video
  @Override
  public VideoProcessingResultMessage handleEncode(VideoProcessingMessage msg) {
    String videoId = msg.getVideoId();
    String ownerId = msg.getOwnerId();
    String originalUrl = msg.getOriginalUrl();

    Path workDir = null;

    try {
      workDir = Files.createTempDirectory("encode-" + videoId + "-");
      Path sourceFile = workDir.resolve("source.mp4");
      Path hlsDir = workDir.resolve("hls");
      Files.createDirectories(hlsDir);

      log.info("Start processing videoId={}, ownerId={}, objectKey={}",
          videoId, ownerId, originalUrl);

      downloadOriginalVideo(originalUrl, sourceFile);
      transcodeToHls(sourceFile, hlsDir);

      String masterPlaylistKey = uploadHlsToProduction(ownerId, videoId, hlsDir);

      log.info("Processing completed videoId={}, masterPlaylistKey={}",
          videoId, masterPlaylistKey);

      return VideoProcessingResultMessage.builder()
          .videoId(videoId)
          .ownerId(ownerId)
          .status(VideoProcessingResult.SUCCESS)
          .hlsUrl(masterPlaylistKey)
          .build();

    } catch (Exception e) {
      log.error("Processing failed videoId={}", videoId, e);

      return VideoProcessingResultMessage.builder()
          .videoId(videoId)
          .ownerId(ownerId)
          .status(VideoProcessingResult.FAILURE)
          .hlsUrl(null)
          .build();
    } finally {
      cleanupDirectory(workDir);
    }
  }

  // download file video thô
  @Override
  public void downloadOriginalVideo(String originalUrl, Path targetFile) {
    try {
      minioClient.downloadObject(
          DownloadObjectArgs.builder()
              .bucket(stagingBucket)
              .object(originalUrl)
              .filename(targetFile.toAbsolutePath().toString())
              .build()
      );

      log.info("Downloaded source file to {}", targetFile);
    } catch (Exception e) {
      log.error("Downloading failed originalUrl={}", originalUrl, e);
      throw new RuntimeException(e);
    }
  }

  // xử lý file video thô
  @Override
  public void transcodeToHls(Path sourceFile, Path hlsDir) {
    try {
      ProcessBuilder processBuilder = getProcessBuilder(sourceFile, hlsDir);

      Process process = processBuilder.start();
      String logs = new String(process.getInputStream().readAllBytes());
      int exitCode = process.waitFor();

      if (exitCode != 0) {
        throw new RuntimeException("FFmpeg failed with exit code " + exitCode + ". Logs: " + logs);
      }

      log.info("Transcoded HLS into {}", hlsDir);
    } catch (Exception e) {
      log.error("Transcoding failed HLS", e);
      throw new RuntimeException(e);
    }
  }

  @NotNull
  private ProcessBuilder getProcessBuilder(Path sourceFile, Path hlsDir) {
    List<String> command = List.of(
        ffmpegBin,
        "-y",
        "-i", sourceFile.toAbsolutePath().toString(),
        "-c:v", "libx264",
        "-c:a", "aac",
        "-preset", "veryfast",
        "-f", "hls",
        "-hls_time", "6",
        "-hls_list_size", "0",
        "-hls_playlist_type", "vod",
        "-hls_flags", "independent_segments",
        "-hls_segment_filename", hlsDir.resolve("segment_%03d.ts").toAbsolutePath().toString(),
        hlsDir.resolve("master.m3u8").toAbsolutePath().toString()
    );

    ProcessBuilder processBuilder = new ProcessBuilder(command);
    processBuilder.redirectErrorStream(true);
    return processBuilder;
  }

  // upload video đã xử lý lên Minio
  @Override
  public String uploadHlsToProduction(String ownerId, String videoId, Path hlsDir) {
    String prefix = ownerId + "/videos/" + videoId + "/hls/";

    try (var paths = Files.walk(hlsDir)) {
      paths
          .filter(Files::isRegularFile)
          .forEach(path -> {
            try {
              String relativePath = hlsDir.relativize(path).toString().replace("\\", "/");
              String objectKey = prefix + relativePath;

              minioClient.uploadObject(
                  UploadObjectArgs.builder()
                      .bucket(productionBucket)
                      .object(objectKey)
                      .filename(path.toAbsolutePath().toString())
                      .contentType(getContentType(path))
                      .build()
              );

              log.info("Uploaded file to production bucket: {}", objectKey);
            } catch (Exception e) {
              throw new RuntimeException("Failed to upload file: " + path, e);
            }
          });
    } catch (Exception e) {
      throw new RuntimeException(e);
    }

    return prefix;
  }

  private String getContentType(Path path) {
    String fileName = path.getFileName().toString().toLowerCase();

    if (fileName.endsWith(".m3u8")) {
      return "application/vnd.apple.mpegurl";
    }
    if (fileName.endsWith(".ts")) {
      return "video/mp2t";
    }
    if (fileName.endsWith(".m4s")) {
      return "video/iso.segment";
    }
    return "application/octet-stream";
  }

  // xóa video thô ở file tạm
  @Override
  public void cleanupDirectory(Path dir) {
    if (dir == null) {
      return;
    }

    try (var paths = Files.walk(dir)) {
      paths
          .sorted(Comparator.reverseOrder())
          .forEach(path -> {
            try {
              Files.deleteIfExists(path);
            } catch (IOException e) {
              log.warn("Failed to delete temp path={}", path, e);
            }
          });
    } catch (IOException e) {
      log.warn("Failed to cleanup workDir={}", dir, e);
    }
  }
}
