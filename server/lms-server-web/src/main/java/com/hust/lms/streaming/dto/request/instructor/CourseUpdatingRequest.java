package com.hust.lms.streaming.dto.request.instructor;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.hust.lms.streaming.dto.validation.XssSanitizerDeserializer;
import com.hust.lms.streaming.enums.LevelCourse;
import jakarta.validation.constraints.*;
import lombok.Getter;
import org.hibernate.validator.constraints.UUID;

@Getter
public class CourseUpdatingRequest {
  @NotBlank(message = "ID không được để trống")
  @UUID(message = "ID không đúng định dạng")
  private String id;

  @NotBlank(message = "Mô tả khóa học không được để trống")
  @Size(min = 20, message = "Mô tả khóa học quá ngắn")
  @JsonDeserialize(using = XssSanitizerDeserializer.class)
  private String description;

  @JsonDeserialize(using = XssSanitizerDeserializer.class)
  private String descriptionShort;

  @JsonDeserialize(using = XssSanitizerDeserializer.class)
  private String requirements;

  @NotNull(message = "Trình độ khóa học không được để trống")
  private LevelCourse level;
}