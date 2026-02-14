package com.hust.lms.streaming.dto.request.instructor;

import lombok.Getter;

@Getter
public class SectionUpdatingRequest {
  private String courseId;
  private String sectionId;
  private String title;
  private String descriptionShort;
}
