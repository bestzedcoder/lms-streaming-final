package com.hust.lms.lms_core_streaming.netty;

public interface PlaybackTokenValidator {

  /**
   * Verify token, nếu hợp lệ thì trả payload.
   * Nếu không hợp lệ thì ném exception.
   */
  PlaybackTokenPayload validate(String token);
}