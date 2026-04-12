package com.hust.lms.streaming.dto.request.upload;

import java.util.List;
import lombok.Getter;

@Getter
public class MultipartCompleteRequest {
  private String uploadId;
  private String fileKey;
  private List<PartETagDTO> parts;
}
