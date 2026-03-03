package com.hust.lms.streaming.dto.response.admin;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CoursePendingResponse {
  private UUID courseId;
  private String title;
  private String description;
  private String thumbnail;
  private String instructorName;
  private String instructorEmail;
}
