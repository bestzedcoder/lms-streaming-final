package com.hust.lms.streaming.configuration;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
public class MomoConfiguration {
  @Value("${payment.momo.partner-code}")
  private String partnerCode;

  @Value("${payment.momo.access-key}")
  private String accessKey;

  @Value("${payment.momo.secret-key}")
  private String secretKey;

  @Value("${payment.momo.pay-url}")
  private String payUrl;

  @Value("${payment.momo.return-url}")
  private String returnUrl;

  @Value("${payment.momo.return-url}")
  private String ipnUrl;
}
