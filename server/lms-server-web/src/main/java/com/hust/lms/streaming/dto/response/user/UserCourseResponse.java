package com.hust.lms.streaming.dto.response.user;

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
public class UserCourseResponse {
  private UUID id;
  private String title;
  private String slug;
  private String descriptionShort;
  private String thumbnail;
  private EnrollmentStatus status;
}
