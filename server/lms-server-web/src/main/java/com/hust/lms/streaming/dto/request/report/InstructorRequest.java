package com.hust.lms.streaming.dto.request.report;

import com.hust.lms.streaming.dto.validation.NoHtml;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class InstructorRequest {
  @NoHtml
  @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
  private String message;
}
