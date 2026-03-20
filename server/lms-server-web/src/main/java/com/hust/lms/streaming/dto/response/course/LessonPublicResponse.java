package com.hust.lms.streaming.dto.response.course;

import com.hust.lms.streaming.enums.LessonType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LessonPublicResponse {
  private String title;
  private LessonType lessonType;
}
