package com.hust.lms.streaming.queue.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VideoProcessingMessage {
  private String ownerId;
  private String videoId;
  private String originalUrl;
}
