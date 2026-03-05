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
  private String fullName;
  private String phoneNumber;
  private long countCourses;
  private long countStudents;
}
