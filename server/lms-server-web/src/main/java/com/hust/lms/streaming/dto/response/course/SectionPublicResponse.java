package com.hust.lms.streaming.dto.response.course;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SectionPublicResponse {
  private String title;
  private String descriptionShort;
  @Builder.Default
  private List<LessonPublicResponse> lessons = new ArrayList<>();
}
