package com.hust.lms.streaming.dto.request.instructor;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import org.hibernate.validator.constraints.UUID;

@Getter
public class ActiveRequest {
  @NotBlank(message = "UserId không được để trống")
  @UUID(message = "UserId không đúng định dạng")
  private String userId;

  @NotBlank(message = "CourseId không được để trống")
  @UUID(message = "CourseId không đúng định dạng")
  private String courseId;
}
