package com.hust.lms.lms_core_streaming.netty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaybackTokenPayload {
  private String userId;
  private String ownerId;
  private String videoId;
  private long expiredAt;
}