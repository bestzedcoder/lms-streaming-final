package com.hust.lms.streaming.dto.response.resource;

import com.hust.lms.streaming.enums.VideoStatus;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InstructorVideoResponse {
  private UUID id;
  private String title;
  private String thumbnail;
  private VideoStatus status;
  private Integer duration;
  private Long size;
}
