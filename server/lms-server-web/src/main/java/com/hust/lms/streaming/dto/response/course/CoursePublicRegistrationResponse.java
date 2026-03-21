package com.hust.lms.streaming.dto.response.course;

import com.hust.lms.streaming.enums.CourseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CoursePublicRegistrationResponse {
  private String title;
  private CourseStatus status;
  private String thumbnail;
}
