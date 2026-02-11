package com.hust.lms.streaming.common;

import java.security.SecureRandom;
import java.util.UUID;

public class Gen {

  private static final String PASSWORD_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  private static final String OTP_CHARS = "0123456789";
  private static final SecureRandom random = new SecureRandom();

  private Gen() {
    throw new AssertionError("Utility class");
  }

  /**
   * output: "550e8400-e29b-41d4-a716-446655440000"
   */
  public static String genUUID() {
    return UUID.randomUUID().toString();
  }

  /**
   * Sinh mật khẩu ngẫu nhiên (Dùng khi reset password hoặc tạo user mới)
   * @param length Độ dài mật khẩu mong muốn
   */
  public static String genPasswordRaw(int length) {
    if (length < 1) throw new IllegalArgumentException("Độ dài phải lớn hơn 0");

    StringBuilder sb = new StringBuilder(length);
    for (int i = 0; i < length; i++) {
      int randomIndex = random.nextInt(PASSWORD_CHARS.length());
      sb.append(PASSWORD_CHARS.charAt(randomIndex));
    }
    return sb.toString();
  }

  /**
   * 3. Sinh mã xác thực OTP (Dùng gửi email verify)
   * @param length Độ dài mã xác thực
   */
  public static String genCode(int length) {
    if (length < 1) throw new IllegalArgumentException("Độ dài phải lớn hơn 0");

    StringBuilder sb = new StringBuilder(length);
    for (int i = 0; i < length; i++) {
      int randomIndex = random.nextInt(OTP_CHARS.length());
      sb.append(OTP_CHARS.charAt(randomIndex));
    }
    return sb.toString();
  }
}