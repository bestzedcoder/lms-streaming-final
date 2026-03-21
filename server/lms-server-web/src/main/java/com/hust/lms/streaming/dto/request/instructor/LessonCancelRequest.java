package com.hust.lms.streaming.dto.request.instructor;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import org.hibernate.validator.constraints.UUID;

@Getter
public class LessonCancelRequest {
  @NotBlank(message = "ID không được để trống")
  @UUID(message = "ID không đúng định dạng")
  private String courseId;

  @NotBlank(message = "ID không được để trống")
  @UUID(message = "ID không đúng định dạng")
  private String sectionId;

  @NotBlank(message = "ID không được để trống")
  @UUID(message = "ID không đúng định dạng")
  private String lessonId;
}
