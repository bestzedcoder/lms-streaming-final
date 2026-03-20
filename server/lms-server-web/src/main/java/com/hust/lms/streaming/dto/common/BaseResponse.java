package com.hust.lms.streaming.dto.common;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaseResponse <T> {
  private LocalDateTime timestamp;
  private int code;
  private boolean success;
  private String message;
  private T data;
}
