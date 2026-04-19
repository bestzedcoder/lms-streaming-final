package com.hust.lms.streaming.queue.message;

import com.hust.lms.streaming.enums.VideoProcessingResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VideoProcessingResultMessage {
  private String videoId;
  private String ownerId;
  private VideoProcessingResult status;
  private String hlsUrl;
}
