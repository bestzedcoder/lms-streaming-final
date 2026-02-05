package com.hust.lms.streaming.queue.message;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MailMessage<T> {
  private String to;
  private String type;
  private T data;
}
