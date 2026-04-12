package com.hust.lms.streaming.dto.request.instructor;

import com.hust.lms.streaming.dto.validation.NoHtml;
import lombok.Getter;

@Getter
public class OptionCreatingRequest {
  @NoHtml
  private String answer;
  private Boolean correct;
}
