package com.hust.lms.streaming.event.custom;

import com.hust.lms.streaming.event.enums.UserEventType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEvent {
  private UserEventType type;
  private String email;
  private String data;

  public UserEvent(UserEventType type, String email) {
    this.type = type;
    this.email = email;
  }
}
