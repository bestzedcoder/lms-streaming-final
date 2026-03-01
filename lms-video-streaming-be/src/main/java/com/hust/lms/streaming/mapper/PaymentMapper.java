package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.payment.InvoiceResponse;
import com.hust.lms.streaming.model.Payment;

public class PaymentMapper {
  private PaymentMapper() {
    throw new AssertionError("Utility class");
  }

  public static InvoiceResponse mapPaymentToInvoiceResponse(Payment payment) {
    if (payment == null) return null;

    InvoiceResponse response = new InvoiceResponse();
    response.setTransactionNo(payment.getTransactionNo());
    response.setMethod(payment.getPaymentMethod());
    return response;
  }
}
