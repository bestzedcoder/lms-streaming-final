package com.hust.lms.streaming.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class ResetPasswordRequest {
  @NotBlank(message = "Email không được để trống")
  @Email(message = "Email không đúng định dạng")
  private String email;
  @NotBlank(message = "Mã xác thực không được để trống")
  @Pattern(regexp = "^\\d{8}$", message = "Mã xác thực không hợp lệ")
  private String code;
}
