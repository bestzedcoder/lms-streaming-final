package com.hust.lms.streaming.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ResourceAccessDeniedException extends RuntimeException {

  public ResourceAccessDeniedException(String message) {
    super(message);
  }

  public ResourceAccessDeniedException() {
    super("Bạn đang truy cập trái phép tài nguyên khác");
  }
}
