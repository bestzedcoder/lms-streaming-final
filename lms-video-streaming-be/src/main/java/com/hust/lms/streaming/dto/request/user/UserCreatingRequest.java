package com.hust.lms.streaming.dto.request.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreatingRequest {

  @NotBlank(message = "Email không được để trống")
  @Email(message = "Email không đúng định dạng")
  private String email;

  @NotBlank(message = "Mật khẩu không được để trống")
  @Size(min = 6, max = 32, message = "Mật khẩu phải từ 6 đến 32 ký tự")
  private String password;

  @NotBlank(message = "Họ tên không được để trống")
  @Size(min = 2, max = 100, message = "Họ tên phải từ 2 đến 100 ký tự")
  private String fullName;

  @NotBlank(message = "Số điện thoại không được để trống")
  @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại không hợp lệ (Phải có 10 số, bắt đầu bằng số 0)")
  private String phone;
}
