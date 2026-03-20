package com.hust.lms.streaming.dto.request.instructor;

import lombok.Getter;

@Getter
public class SectionCreatingRequest {
  private String courseId;
  private String title;
  private String descriptionShort;
}
