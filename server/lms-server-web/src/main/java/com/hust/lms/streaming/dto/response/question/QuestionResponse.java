package com.hust.lms.streaming.dto.response.question;

import com.hust.lms.streaming.enums.QuestionType;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionResponse {
  private UUID id;
  private String content;
  private QuestionType type;
  private List<OptionResponse> options;
}
