package com.hust.lms.streaming.dto.response.payment;

import com.hust.lms.streaming.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {
  private String transactionNo;
  private PaymentMethod method;
}
