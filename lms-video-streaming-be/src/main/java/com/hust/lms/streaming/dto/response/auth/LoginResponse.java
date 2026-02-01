package com.hust.lms.streaming.dto.response.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
  private String accessToken;
  private String refreshToken;
}
