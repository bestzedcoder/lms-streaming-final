package com.hust.lms.streaming.dto.response.category;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
  private UUID id;
  private String name;
  private String slug;
  private String icon;
  private int countCourses;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private String updatedBy;
}
