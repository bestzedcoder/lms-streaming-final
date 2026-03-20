package com.hust.lms.streaming.upload;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CloudinaryUploadResult {
  private String url;
  private String publicId;
}
