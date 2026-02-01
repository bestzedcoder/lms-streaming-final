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
public class PageResponse <T> {
  private int currentPages;
  private int pageSizes;
  private int totalPages;
  private long totalElements;
  private List<T> result;
  private boolean success;
  private String message;
  private int code;
  private LocalDateTime timestamp;
}
