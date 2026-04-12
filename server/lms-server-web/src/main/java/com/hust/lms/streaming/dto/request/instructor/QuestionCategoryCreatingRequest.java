package com.hust.lms.streaming.dto.request.instructor;

import com.hust.lms.streaming.dto.validation.NoHtml;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class QuestionCategoryCreatingRequest {
  @NoHtml
  @Size(min = 5, max = 20, message = "Tên có độ dài tối thiểu là 8 và lớn nhất là 20")
  private String name;
}
