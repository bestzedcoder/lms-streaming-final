package com.hust.lms.streaming.dto.request.instructor;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.hust.lms.streaming.dto.validation.NoHtml;
import com.hust.lms.streaming.dto.validation.XssSanitizerDeserializer;
import com.hust.lms.streaming.enums.LevelCourse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseCreatingRequest {

  @NotBlank(message = "Tên khóa học không được để trống")
  @Size(min = 10, max = 200, message = "Tên khóa học phải từ 10 đến 200 ký tự")
  @NoHtml(message = "Tên khóa học chứa ký tự không hợp lệ")
  private String title;

  @NotBlank(message = "Slug không được để trống")
  @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug chỉ được chứa chữ thường, số và dấu gạch ngang")
  @NoHtml(message = "Slug chứa ký tự không hợp lệ")
  private String slug;

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

  @NotBlank(message = "Danh mục không được để trống")
  @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug danh mục không hợp lệ")
  @NoHtml(message = "Slug chứa ký tự không hợp lệ")
  private String categorySlug;
}