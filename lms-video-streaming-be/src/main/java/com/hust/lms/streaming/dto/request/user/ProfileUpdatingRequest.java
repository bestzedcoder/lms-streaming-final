package com.hust.lms.streaming.dto.request.user;

import com.hust.lms.streaming.dto.validation.NoHtml;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class ProfileUpdatingRequest {

  @NotBlank(message = "Họ tên không được để trống")
  @Size(min = 4, max = 100, message = "Họ tên phải từ 2 đến 100 ký tự")
  @NoHtml(message = "Họ tên chứa ký tự không hợp lệ")
  private String fullName;

  @NotBlank(message = "Số điện thoại không được để trống")
  @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại không hợp lệ")
  private String phone;
}
