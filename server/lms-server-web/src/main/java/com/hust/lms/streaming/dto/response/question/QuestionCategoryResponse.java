package com.hust.lms.streaming.dto.response.question;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionCategoryResponse {
  private UUID id;
  private String name;
  private Integer totalQuestions;
}
