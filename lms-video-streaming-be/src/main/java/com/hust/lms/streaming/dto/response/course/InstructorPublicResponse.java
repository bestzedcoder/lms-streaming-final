package com.hust.lms.streaming.dto.response.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorPublicResponse {
  private String fullName;
  private String title;
  private String bio;
  private String avatarUrl;
  private int totalCourses;
}
