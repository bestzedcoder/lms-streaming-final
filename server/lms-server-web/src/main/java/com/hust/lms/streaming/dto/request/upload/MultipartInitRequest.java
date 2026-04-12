package com.hust.lms.streaming.dto.request.upload;

import lombok.Getter;

@Getter
public class MultipartInitRequest {
  private String fileName;
  private int totalParts;
}
