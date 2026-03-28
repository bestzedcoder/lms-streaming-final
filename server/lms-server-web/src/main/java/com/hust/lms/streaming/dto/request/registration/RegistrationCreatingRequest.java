package com.hust.lms.streaming.dto.request.registration;

import com.hust.lms.streaming.dto.validation.NoHtml;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.hibernate.validator.constraints.UUID;

@Getter
public class RegistrationCreatingRequest {
  @NotBlank(message = "slug không được để trống")
  private String slug;

  @NoHtml
  @Size(max = 500, message = "Message tối đa 500 ký tự")
  private String message;
}
