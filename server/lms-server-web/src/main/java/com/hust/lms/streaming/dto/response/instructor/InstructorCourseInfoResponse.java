package com.hust.lms.streaming.dto.response.instructor;

import com.hust.lms.streaming.dto.response.review.ReviewCourseResponse;
import com.hust.lms.streaming.dto.response.user.UserPublicResponse;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorCourseInfoResponse {
  private InstructorCourseResponse course;
  @Builder.Default
  private List<InstructorCourseParticipantResponse> students = new ArrayList<>();
  @Builder.Default
  private List<ReviewCourseResponse> reviews = new ArrayList<>();
}
