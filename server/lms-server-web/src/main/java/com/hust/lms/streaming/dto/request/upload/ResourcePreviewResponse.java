package com.hust.lms.streaming.dto.request.upload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResourcePreviewResponse {
  private String url;
  private String title;
}
