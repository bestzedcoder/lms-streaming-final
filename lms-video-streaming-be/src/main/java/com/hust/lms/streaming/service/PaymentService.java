package com.hust.lms.streaming.service;

import com.hust.lms.streaming.enums.PaymentMethod;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface PaymentService {
  String createPayment(String code, PaymentMethod method);
  void handlePaymentCallback(HttpServletRequest request, HttpServletResponse response, PaymentMethod method);
}
