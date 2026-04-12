package com.hust.lms.streaming.dto.request.upload;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MultipartInitResponse {
  private String uploadId;
  private String fileKey;
  private List<String> presignedUrls;
}
