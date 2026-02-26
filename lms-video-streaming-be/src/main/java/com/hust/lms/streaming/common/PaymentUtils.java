package com.hust.lms.streaming.common;

import jakarta.servlet.http.HttpServletRequest;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class PaymentUtils {

  private PaymentUtils() {
    throw new AssertionError("Utility class");
  }

  /**
   * HMAC-SHA512 dùng cho VNPay
   */
  public static String hmacSHA512(String data, String secret) {
    return hmac(data, secret, "HmacSHA512");
  }

  /**
   * HMAC-SHA256 dùng cho MoMo
   */
  public static String hmacSHA256(String data, String secret) {
    return hmac(data, secret, "HmacSHA256");
  }

  /**
   * Hàm băm tổng quát giúp code sạch hơn
   */
  private static String hmac(String data, String secret, String algorithm) {
    try {
      if (secret == null || data == null) {
        throw new NullPointerException();
      }
      Mac mac = Mac.getInstance(algorithm);
      SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), algorithm);
      mac.init(keySpec);
      byte[] bytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

      StringBuilder sb = new StringBuilder(2 * bytes.length);
      for (byte b : bytes) {
        sb.append(String.format("%02x", b & 0xff));
      }
      return sb.toString();
    } catch (Exception e) {
      throw new RuntimeException("Cannot generate hash with " + algorithm, e);
    }
  }

  /**
   * Xây dựng Query String từ Map, mặc định sắp xếp theo Key Alphabet
   */
  public static String buildPaymentUrl(Map<String, String> paramsMap, boolean encodeKey) {
    return paramsMap.entrySet().stream()
        .filter(entry -> entry.getValue() != null && !entry.getValue().isEmpty())
        .sorted(Map.Entry.comparingByKey())
        .map(entry ->
            (encodeKey ? URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII)
                : entry.getKey()) + "=" +
                URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII))
        .collect(Collectors.joining("&"));
  }

  /**
   * Lấy địa chỉ IP thực của client
   */
  public static String getIpAddress(HttpServletRequest request) {
    String ip = request.getHeader("X-Forwarded-For");
    if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
      return ip.split(",")[0].trim();
    }
    return request.getRemoteAddr();
  }
}