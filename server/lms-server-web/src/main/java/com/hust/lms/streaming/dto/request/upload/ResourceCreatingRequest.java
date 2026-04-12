package com.hust.lms.streaming.dto.request.upload;

import lombok.Getter;

@Getter
public class ResourceCreatingRequest {
  private String fileKey;
  private String title;
  private Long size;
}
