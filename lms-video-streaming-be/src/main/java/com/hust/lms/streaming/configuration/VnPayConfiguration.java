package com.hust.lms.streaming.configuration;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
public class VnPayConfiguration {
  @Value("${payment.vnpay.tmn-code}")
  private String tmnCode;

  @Value("${payment.vnpay.hash-secret}")
  private String hashSecret;

  @Value("${payment.vnpay.pay-url}")
  private String payUrl;

  @Value("${payment.vnpay.return-url}")
  private String returnUrl;

  @Value("${payment.vnpay.version}")
  private String version;

  @Value("${payment.vnpay.command}")
  private String command;

  @Value("${payment.vnpay.order-type}")
  private String orderType;
}
