package com.hust.lms.streaming.payment;

import com.hust.lms.streaming.enums.PaymentMethod;

public interface PaymentStrategy {
  String createPaymentUrl(PaymentData request);
  PaymentMethod getMethod();
}
