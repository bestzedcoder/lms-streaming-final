package com.hust.lms.streaming.dto.request.instructor;

import com.hust.lms.streaming.dto.validation.NoHtml;
import com.hust.lms.streaming.enums.QuestionType;
import java.util.List;
import lombok.Getter;

@Getter
public class QuestionUpdatingRequest {
  private String id;
  @NoHtml
  private String content;
  private QuestionType type;
  private List<OptionCreatingRequest> options;
}
