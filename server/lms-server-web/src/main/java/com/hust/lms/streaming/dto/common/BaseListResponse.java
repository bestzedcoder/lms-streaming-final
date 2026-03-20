package com.hust.lms.streaming.dto.common;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaseListResponse <T> {
  private LocalDateTime timestamp;
  private int code;
  private boolean success;
  private String message;
  private List<T> data;
}
