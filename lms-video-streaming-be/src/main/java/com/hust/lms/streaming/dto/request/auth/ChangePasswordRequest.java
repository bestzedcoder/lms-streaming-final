package com.hust.lms.streaming.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class ChangePasswordRequest {
  @NotBlank(message = "Vui lòng nhập mật khẩu hiện tại")
  private String oldPassword;

  @NotBlank(message = "Vui lòng nhập mật khẩu mới")
  @Size(min = 8, max = 32, message = "Mật khẩu mới phải từ 8 đến 32 ký tự")
  @Pattern(
      // Regex giải thích:
      // (?=.*[0-9]): Ít nhất 1 số
      // (?=.*[a-z]): Ít nhất 1 chữ thường
      // (?=.*[A-Z]): Ít nhất 1 chữ hoa
      // (?=.*[@#$%^&+=!]): Ít nhất 1 ký tự đặc biệt (tùy chỉnh theo nhu cầu)
      // (?=\S+$): Không chứa khoảng trắng
      regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
      message = "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
  )
  private String newPassword;
}
