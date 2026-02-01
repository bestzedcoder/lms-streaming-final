package com.hust.lms.streaming.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.hibernate.validator.constraints.UUID;

@Getter
public class LockAccountRequest {

  @NotBlank(message = "ID không được để trống")
  @UUID(message = "ID không đúng định dạng")
  private String uuid;

  @NotBlank(message = "Lý do không được để trống")
  @Size(max = 500, message = "Lý do không được vượt quá 500 ký tự")
  @Pattern(
      regexp = "^[\\p{L}\\p{N}\\s.,;?\\-()_]+$",
      message = "Lý do chứa ký tự không hợp lệ"
  )
  private String reason;
}