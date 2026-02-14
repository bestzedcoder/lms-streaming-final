package com.hust.lms.streaming.dto.response.instructor;

import com.hust.lms.streaming.enums.LessonType;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorLessonResponse {
  private UUID id;
  private String title;
  private LessonType lessonType;
  private boolean isPreview;
}
