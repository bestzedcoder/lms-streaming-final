package com.hust.lms.streaming.dto.response.course;

import com.hust.lms.streaming.enums.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseAuthDetailsResponse {
  private CoursePublicDetailsResponse course;
  private boolean hasAccess;
  private EnrollmentStatus status;
}
