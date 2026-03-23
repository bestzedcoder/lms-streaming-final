package com.hust.lms.streaming.dto.response.instructor;

import com.hust.lms.streaming.enums.EnrollmentStatus;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorCourseParticipantResponse {
  private UUID id;
  private String fullName;
  private String email;
  private String phone;
  private String avatarUrl;
  private EnrollmentStatus status;
}
