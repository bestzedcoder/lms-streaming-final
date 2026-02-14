package com.hust.lms.streaming.dto.request.instructor;

import lombok.Getter;

@Getter
public class LessonCancelRequest {
  private String courseId;
  private String sectionId;
  private String lessonId;
}
