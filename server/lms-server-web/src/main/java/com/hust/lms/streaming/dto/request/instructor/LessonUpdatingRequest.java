package com.hust.lms.streaming.dto.request.instructor;

import com.hust.lms.streaming.dto.validation.NoHtml;
import com.hust.lms.streaming.enums.LessonType;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import org.hibernate.validator.constraints.UUID;

@Getter
public class LessonUpdatingRequest {
  @NotBlank(message = "ID không được để trống")
  @UUID(message = "ID không đúng định dạng")
  private String lessonId;

  @NotBlank(message = "ID không được để trống")
  @UUID(message = "ID không đúng định dạng")
  private String sectionId;

  @NotBlank(message = "ID không được để trống")
  @UUID(message = "ID không đúng định dạng")
  private String courseId;

  @NoHtml
  private String title;
  private LessonType lessonType;
  private boolean preview;
}
