package com.hust.lms.streaming.dto.request.instructor;

import com.hust.lms.streaming.enums.LessonType;
import lombok.Getter;

@Getter
public class LessonUpdatingRequest {
  private String lessonId;
  private String sectionId;
  private String courseId;
  private String title;
  private LessonType lessonType;
  private boolean isPreview;
}
