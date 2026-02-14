package com.hust.lms.streaming.dto.request.instructor;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.hust.lms.streaming.dto.validation.NoHtml;
import com.hust.lms.streaming.dto.validation.XssSanitizerDeserializer;
import com.hust.lms.streaming.enums.LevelCourse;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.UUID;

@Getter
@Setter
public class CourseUpdatingRequest {
  @NotBlank(message = "ID không được để trống")
  @UUID(message = "ID không đúng định dạng")
  private String id;

  @NotBlank(message = "Tên khóa học không được để trống")
  @Size(min = 10, max = 200, message = "Tên khóa học phải từ 10 đến 200 ký tự")
  @NoHtml(message = "Tên khóa học chứa ký tự không hợp lệ")
  private String title;

  @NotBlank(message = "Mô tả khóa học không được để trống")
  @Size(min = 20, message = "Mô tả khóa học quá ngắn")
  @JsonDeserialize(using = XssSanitizerDeserializer.class)
  private String description;

  @NotNull(message = "Giá khóa học không được để trống")
  @Min(value = 0, message = "Giá khóa học không được âm")
  private BigDecimal price;

  @Min(value = 0, message = "Giá khuyến mãi không được âm")
  private BigDecimal salePrice;

  @NotNull(message = "Trình độ khóa học không được để trống")
  private LevelCourse level;

  // Tự động kiểm tra logic: Sale Price phải nhỏ hơn Price
  @AssertTrue(message = "Giá khuyến mãi phải nhỏ hơn giá gốc")
  public boolean isValidSalePrice() {
    if (salePrice == null || price == null) {
      return true;
    }
    return salePrice.compareTo(price) <= 0;
  }
}