package com.hust.lms.streaming.dto.response.admin;

import com.hust.lms.streaming.enums.CourseStatus;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseOfInstructorResponse {
  private UUID courseId;
  private String title;
  private String slug;
  private BigDecimal price;
  private CourseStatus status;
  private String category;
  private int countStudents;
}
