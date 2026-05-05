package com.hust.lms.streaming.dto.response.instructor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorPublicResponse {
  private String nickname;
  private String title;
  private String bio;
  private String avatarUrl;
  private int totalCourses;
  private int totalStudents;
}
