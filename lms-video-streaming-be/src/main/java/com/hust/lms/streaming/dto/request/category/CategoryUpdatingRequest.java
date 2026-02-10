package com.hust.lms.streaming.dto.request.category;

import com.hust.lms.streaming.dto.validation.NoHtml;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.hibernate.validator.constraints.URL;

@Getter
public class CategoryUpdatingRequest {
  @NotBlank(message = "Tên danh mục không được để trống")
  @Size(min = 3, max = 50, message = "Tên danh mục phải từ 3 đến 50 ký tự")
  @Pattern(
      regexp = "^[a-zA-Z0-9\\sÀ-ỹ_&-]+$",
      message = "Tên danh mục chứa ký tự không hợp lệ (Chỉ chấp nhận chữ, số và ký tự _, &, -)"
  )
  @NoHtml(message = "Tên danh mục chứa ký tự không hợp lệ")
  private String name;

  @NotBlank(message = "Slug không được để trống")
  @Size(min = 3, max = 50, message = "Slug phải từ 3 đến 50 ký tự")
  @Pattern(
      regexp = "^[a-z0-9-]+$",
      message = "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"
  )
  @NoHtml(message = "Slug chứa ký tự không hợp lệ")
  private String slug;

  //  @NotBlank(message = "Icon không được để trống")
  @URL(message = "Icon phải là một đường dẫn hợp lệ")
  @Pattern(
      regexp = "^(http|https)://.*$",
      message = "Icon phải bắt đầu bằng http:// hoặc https://"
  )
  private String icon;
}
