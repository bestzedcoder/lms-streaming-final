package com.hust.lms.streaming.dto.request.upload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UploadFileResponse {
  private String fileKey;
  private String presignedUrl;
}
