package com.hust.lms.streaming.dto.request.instructor;

import lombok.Getter;

@Getter
public class SectionCancelRequest {
  private String courseId;
  private String sectionId;
}
