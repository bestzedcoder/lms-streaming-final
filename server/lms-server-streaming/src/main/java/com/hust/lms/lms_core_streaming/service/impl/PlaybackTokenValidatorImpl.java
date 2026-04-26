package com.hust.lms.lms_core_streaming.netty;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Class này chạy ở streaming server.
 *
 * Nhiệm vụ:
 * - đọc token do Web Server cấp
 * - verify chữ ký HMAC
 * - decode payload
 * - check hạn dùng
 *
 * Nếu token sai -> chặn request media ngay tại Netty handler.
 */
@Component
public class PlaybackTokenValidatorImpl implements PlaybackTokenValidator {

  @Value("${app.playback.secret}")
  private String playbackSecret;

  @Override
  public PlaybackTokenPayload validate(String token) {
    try {
      String[] parts = token.split("\\.");
      if (parts.length != 2) {
        throw new IllegalArgumentException("Invalid token format");
      }

      String payloadBase64 = parts[0];
      String signatureBase64 = parts[1];

      String payload = new String(
          Base64.getUrlDecoder().decode(payloadBase64),
          StandardCharsets.UTF_8
      );

      byte[] expectedSignature = hmacSha256(payload, playbackSecret);
      byte[] actualSignature = Base64.getUrlDecoder().decode(signatureBase64);

      if (!MessageDigest.isEqual(expectedSignature, actualSignature)) {
        throw new IllegalArgumentException("Invalid token signature");
      }

      String[] fields = payload.split("\\|");
      if (fields.length != 4) {
        throw new IllegalArgumentException("Invalid token payload");
      }

      PlaybackTokenPayload result = new PlaybackTokenPayload(
          fields[0], // userId
          fields[1], // ownerId
          fields[2], // videoId
          Long.parseLong(fields[3]) // expiredAt
      );

      if (Instant.now().getEpochSecond() > result.getExpiredAt()) {
        throw new IllegalArgumentException("Token expired");
      }

      return result;
    } catch (Exception e) {
      throw new RuntimeException("Playback token is invalid", e);
    }
  }

  private byte[] hmacSha256(String value, String secret) {
    try {
      Mac mac = Mac.getInstance("HmacSHA256");
      mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
      return mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
    } catch (Exception e) {
      throw new RuntimeException("Cannot verify playback token", e);
    }
  }
}