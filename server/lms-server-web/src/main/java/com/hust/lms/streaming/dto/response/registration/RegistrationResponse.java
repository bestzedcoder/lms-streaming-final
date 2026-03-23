package com.hust.lms.streaming.dto.response.registration;

import com.hust.lms.streaming.dto.response.course.CoursePublicRegistrationResponse;
import com.hust.lms.streaming.dto.response.user.UserPublicResponse;
import com.hust.lms.streaming.enums.RegistrationStatus;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationResponse {
  private UUID id;
  private RegistrationStatus status;
  private UserPublicResponse student;
  private CoursePublicRegistrationResponse course;
}
