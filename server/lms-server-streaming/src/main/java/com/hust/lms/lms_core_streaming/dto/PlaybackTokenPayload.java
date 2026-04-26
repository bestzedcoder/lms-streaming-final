package com.hust.lms.lms_core_streaming.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaybackTokenPayload {
  private String shortLink;
  private long expiredAt;
}