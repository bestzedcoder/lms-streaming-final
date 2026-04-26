package com.hust.lms.lms_core_streaming.service;

import com.hust.lms.lms_core_streaming.dto.PlaybackTokenPayload;

public interface PlaybackTokenValidator {

  /**
   * Verify token, nếu hợp lệ thì trả payload.
   * Nếu không hợp lệ thì ném exception.
   */
  PlaybackTokenPayload validate(String token);
}