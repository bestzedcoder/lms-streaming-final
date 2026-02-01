package com.hust.lms.streaming.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Getter
public class SignUpRequest {
  @NotBlank(message = "Email không được để trống")
  @Email(message = "Email không đúng định dạng")
  private String email;

  @NotBlank(message = "Mật khẩu không được để trống")
  @Size(min = 6, max = 32, message = "Mật khẩu phải từ 6 đến 32 ký tự")
  private String password;

  @NotBlank(message = "Họ tên không được để trống")
  @Size(min = 2, max = 100, message = "Họ tên phải từ 2 đến 100 ký tự")
  private String fullName;
}
