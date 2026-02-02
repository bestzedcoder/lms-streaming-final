package com.hust.lms.streaming.dto.request.auth;

import lombok.Getter;

@Getter
public class VerifyAccountRequest {
  private String email;
  private String code;
}
