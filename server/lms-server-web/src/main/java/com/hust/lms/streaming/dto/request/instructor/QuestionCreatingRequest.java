package com.hust.lms.streaming.dto.request.instructor;

import com.hust.lms.streaming.dto.validation.NoHtml;
import com.hust.lms.streaming.enums.QuestionType;
import java.util.List;
import lombok.Getter;

@Getter
public class QuestionCreatingRequest {
  private String categoryId;
  @NoHtml
  private String content;
  private QuestionType type;
  private List<OptionCreatingRequest> options;
}
