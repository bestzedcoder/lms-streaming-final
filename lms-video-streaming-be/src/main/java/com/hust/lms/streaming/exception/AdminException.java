package com.hust.lms.streaming.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AdminException extends RuntimeException {
  public AdminException(String message) {
    super(message);
  }
}
