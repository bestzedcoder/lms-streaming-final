package com.hust.lms.streaming.payment;

import com.hust.lms.streaming.common.PaymentUtils;
import com.hust.lms.streaming.configuration.MomoConfiguration;
import com.hust.lms.streaming.enums.PaymentMethod;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class MomoStrategy implements PaymentStrategy{
  private final MomoConfiguration config;
  private final RestTemplate restTemplate = new RestTemplate();

  @Override
  public String createPaymentUrl(PaymentData request) {
    String requestId = config.getPartnerCode() + System.currentTimeMillis();
    String extraData = "";
    String requestType = "captureWallet";

    String amountStr = String.valueOf(request.getAmount().longValue());

    String rawSignature = "accessKey=" + config.getAccessKey() +
        "&amount=" + amountStr +
        "&extraData=" + extraData +
        "&ipnUrl=" + config.getIpnUrl() +
        "&orderId=" + request.getOrderCode() +
        "&orderInfo=" + request.getOrderInfo() +
        "&partnerCode=" + config.getPartnerCode() +
        "&redirectUrl=" + config.getReturnUrl() +
        "&requestId=" + requestId +
        "&requestType=" + requestType;

    String signature = PaymentUtils.hmacSHA256(rawSignature, config.getSecretKey());

    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("partnerCode", config.getPartnerCode());
    requestBody.put("accessKey", config.getAccessKey());
    requestBody.put("requestId", requestId);
    requestBody.put("amount", amountStr);
    requestBody.put("orderId", request.getOrderCode());
    requestBody.put("orderInfo", request.getOrderInfo());
    requestBody.put("redirectUrl", config.getReturnUrl());
    requestBody.put("ipnUrl", config.getIpnUrl());
    requestBody.put("extraData", extraData);
    requestBody.put("requestType", requestType);
    requestBody.put("signature", signature);
    requestBody.put("lang", "vi");

    try {
      ResponseEntity<Map> response = restTemplate.postForEntity(config.getPayUrl(), requestBody, Map.class);
      if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
        return (String) response.getBody().get("payUrl");
      }
    } catch (Exception e) {
      throw new RuntimeException("Lỗi kết nối cổng thanh toán MoMo: " + e.getMessage());
    }
    return null;
  }

  @Override
  public PaymentMethod getMethod() {
    return PaymentMethod.MOMO;
  }
}
