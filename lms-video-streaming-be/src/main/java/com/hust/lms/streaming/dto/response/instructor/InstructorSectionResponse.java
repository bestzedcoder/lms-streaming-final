package com.hust.lms.streaming.dto.response.instructor;

import java.util.ArrayList;
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
public class InstructorSectionResponse {
  private UUID id;
  private String title;
  private String descriptionShort;
  private int countLessons;
  @Builder.Default
  private List<InstructorLessonResponse> lessons = new ArrayList<>();
}
