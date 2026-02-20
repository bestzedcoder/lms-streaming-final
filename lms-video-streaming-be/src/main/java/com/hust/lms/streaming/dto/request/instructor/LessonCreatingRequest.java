package com.hust.lms.streaming.dto.request.instructor;

import com.hust.lms.streaming.enums.LessonType;
import lombok.Getter;

@Getter
public class LessonCreatingRequest {
  private String courseId;
  private String sectionId;
  private String title;
  private LessonType lessonType;
  private boolean preview;
}
