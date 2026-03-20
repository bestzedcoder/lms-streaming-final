package com.hust.lms.streaming.dto.response.instructor;

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
public class InstructorCourseDetailsResponse {
  private InstructorCourseResponse course;
  @Builder.Default
  private List<InstructorSectionResponse> sections = new ArrayList<>();
}
