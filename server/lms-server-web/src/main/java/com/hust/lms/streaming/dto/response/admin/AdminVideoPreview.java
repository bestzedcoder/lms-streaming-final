package com.hust.lms.streaming.dto.response.admin;

import com.hust.lms.streaming.enums.VideoStatus;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminVideoPreview {
  private UUID videoId;
  private String title;
  private VideoStatus status;
  private String owner;
}
