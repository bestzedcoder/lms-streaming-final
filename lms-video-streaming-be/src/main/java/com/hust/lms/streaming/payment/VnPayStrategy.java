package com.hust.lms.streaming.payment;

import com.hust.lms.streaming.common.PaymentUtils;
import com.hust.lms.streaming.configuration.VnPayConfiguration;
import com.hust.lms.streaming.enums.PaymentMethod;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VnPayStrategy implements PaymentStrategy {
  private final VnPayConfiguration config;

  @Override
  public String createPaymentUrl(PaymentData request) {
    Map<String, String> vnp_params = new HashMap<>();
    vnp_params.put("vnp_Version", config.getVersion());
    vnp_params.put("vnp_Command", config.getCommand());
    vnp_params.put("vnp_TmnCode", config.getTmnCode());
    vnp_params.put("vnp_Amount", String.valueOf(request.getAmount() * 100));
    vnp_params.put("vnp_CurrCode", "VND");
    vnp_params.put("vnp_TxnRef", request.getOrderCode());
    vnp_params.put("vnp_OrderInfo", request.getOrderInfo());
    vnp_params.put("vnp_OrderType", config.getOrderType());
    vnp_params.put("vnp_Locale", "vn");
    vnp_params.put("vnp_ReturnUrl", config.getReturnUrl());
    vnp_params.put("vnp_IpAddr", request.getIpAddress());

    Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
    SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
    String vnpCreateDate = formatter.format(calendar.getTime());
    calendar.add(Calendar.MINUTE, 15);
    String vnpExpireDate = formatter.format(calendar.getTime());
    vnp_params.put("vnp_CreateDate" , vnpCreateDate);
    vnp_params.put("vnp_ExpireDate" , vnpExpireDate);

    // Build dữ liệu để băm
    String paymentUrl = PaymentUtils.buildPaymentUrl(vnp_params, true);
    String hashData = PaymentUtils.buildPaymentUrl(vnp_params, false);
    String vnp_SecureHash = PaymentUtils.hmacSHA512(hashData, config.getHashSecret());

    return config.getPayUrl() + "?" + paymentUrl + "&vnp_SecureHash=" + vnp_SecureHash;
  }

  @Override
  public PaymentMethod getMethod() {
    return PaymentMethod.VNPAY;
  }
}
