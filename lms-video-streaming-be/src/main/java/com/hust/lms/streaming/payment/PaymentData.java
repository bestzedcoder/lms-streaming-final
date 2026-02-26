package com.hust.lms.streaming.payment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentData {
  private String orderCode;
  private Long amount;
  private String orderInfo;
  private String ipAddress;
}
