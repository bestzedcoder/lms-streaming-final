package com.hust.lms.streaming.event.custom;

import com.hust.lms.streaming.event.enums.AuthEventType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthEvent {
  private AuthEventType type;
  private String email;
  private String data; // otp or raw password
}
