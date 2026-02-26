package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.payment.PaymentCreatingRequest;
import com.hust.lms.streaming.enums.PaymentMethod;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface PaymentService {
  String initPayment(PaymentCreatingRequest request, HttpServletRequest servletRequest);
  void handlePaymentCallback(HttpServletRequest request, HttpServletResponse response, PaymentMethod method);
}
