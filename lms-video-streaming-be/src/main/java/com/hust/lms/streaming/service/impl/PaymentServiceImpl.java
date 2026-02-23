package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.enums.PaymentMethod;
import com.hust.lms.streaming.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

  @Value("${payment.vnpay.pay-url}")
  private String VNPAY_BASE_URL;

  @Value("${payment.vnpay.hash-secret}")
  private String VNPAY_HASH_SECRET;

  @Override
  public String createPayment(String code, PaymentMethod method) {
    String paymentUrl = method.equals(PaymentMethod.VNPAY) ? VNPAY_BASE_URL : "";

    return paymentUrl;
  }

  @Override
  public void handlePaymentCallback(HttpServletRequest request, HttpServletResponse response,
      PaymentMethod method) {

  }
}
