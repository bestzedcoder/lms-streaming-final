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
public class InstructorResponse {
  private UUID instructorId;
  private String email;
  private String nickname;
  private String phoneNumber;
  private int totalCourses;
  private int totalStudents;
}
