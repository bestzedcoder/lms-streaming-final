package com.hust.lms.streaming.dto.request.payment;

import com.hust.lms.streaming.enums.PaymentMethod;
import lombok.Getter;

@Getter
public class PaymentCreatingRequest {
  private String code;
  private PaymentMethod method;
}
