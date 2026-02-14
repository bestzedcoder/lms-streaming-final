package com.hust.lms.streaming.dto.request.instructor;

import com.hust.lms.streaming.enums.CourseStatus;
import lombok.Getter;

@Getter
public class CourseStatusRequest {
  private String id;
  private CourseStatus status;
}
