package com.hust.lms.lms_core_streaming.service;

import com.hust.lms.lms_core_streaming.dto.VideoProcessingResultMessage;
import com.hust.lms.lms_core_streaming.queue.message.VideoProcessingMessage;
import java.nio.file.Path;

public interface StreamingService {
  VideoProcessingResultMessage handleEncode(VideoProcessingMessage msg);
  void downloadOriginalVideo(String originalUrl, Path targetFile);
  void transcodeToHls(Path sourceFile, Path hlsDir);
  String uploadHlsToProduction(String ownerId, String videoId, Path hlsDir);
  void cleanupDirectory(Path dir);
}
