package com.hust.lms.streaming.event.custom;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoEvent {
  private UUID videoId;
  private UUID ownerId;
  private String originalUrl;
}
