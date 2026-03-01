package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.payment.PaymentCreatingRequest;
import com.hust.lms.streaming.dto.response.payment.InvoiceResponse;
import com.hust.lms.streaming.enums.PaymentMethod;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public interface PaymentService {
  String initPayment(PaymentCreatingRequest request, HttpServletRequest servletRequest);
  void handlePaymentCallback(HttpServletRequest request, HttpServletResponse response, PaymentMethod method)
      throws IOException;

  InvoiceResponse invoice(String code);
}
