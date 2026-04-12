package com.hust.lms.streaming.dto.request.upload;

import lombok.Getter;

@Getter
public class VideoCreatingRequest {
  private String fileKey;
  private String title;
  private Integer duration;
  private Long size;
}
