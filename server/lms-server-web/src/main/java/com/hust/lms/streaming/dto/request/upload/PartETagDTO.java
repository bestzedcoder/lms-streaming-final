package com.hust.lms.streaming.dto.request.upload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class PartETagDTO {
  private int partNumber;
  @JsonProperty("eTag")
  private String eTag;
}
