package com.hust.lms.streaming.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import org.hibernate.validator.constraints.UUID;

@Getter
public class UnlockAccountRequest {
  @NotBlank(message = "ID không được để trống")
  @UUID(message = "ID không đúng định dạng")
  private String uuid;
}
