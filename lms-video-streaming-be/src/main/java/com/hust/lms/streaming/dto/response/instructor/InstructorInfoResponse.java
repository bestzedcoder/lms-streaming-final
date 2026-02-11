package com.hust.lms.streaming.dto.response.instructor;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorInfoResponse {
  private String title;
  private String bio;
  private int totalStudents;
  private int totalCourses;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
