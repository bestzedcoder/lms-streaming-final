package com.hust.lms.streaming.common;


import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class VNPayUtils {

  private VNPayUtils() {
    throw new AssertionError("Utility class");
  }

  public static String hmacSHA512(String data, String secret) {
    try {
      if (secret == null || data == null) {
        throw new NullPointerException();
      }
      Mac hmac512 = Mac.getInstance("HmacSHA512");
      SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
      hmac512.init(keySpec);
      byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));

      StringBuilder sb = new StringBuilder(2 * bytes.length);
      for (byte b : bytes) {
        sb.append(String.format("%02x", b & 0xff));
      }
      return sb.toString();
    } catch (Exception e) {
      throw new RuntimeException("Cannot generate hash", e);
    }
  }

  public static String buildPaymentUrl(Map<String, String> paramsMap, boolean encodeKey) {
    return paramsMap.entrySet().stream()
        .filter(entry -> entry.getValue() != null && !entry.getValue().isEmpty())
        .sorted(Map.Entry.comparingByKey())
        .map(entry ->
            (encodeKey ? URLEncoder.encode(entry.getKey(),
                StandardCharsets.US_ASCII)
                : entry.getKey()) + "=" +
                URLEncoder.encode(entry.getValue()
                    , StandardCharsets.US_ASCII))
        .collect(Collectors.joining("&"));
  }
}
