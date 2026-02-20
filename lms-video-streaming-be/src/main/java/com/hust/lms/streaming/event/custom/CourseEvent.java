package com.hust.lms.streaming.event.custom;

import com.hust.lms.streaming.event.enums.CourseEventType;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.elasticsearch.CourseDocumentDto;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CourseEvent {
  private CourseEventType type;
  private UUID instructorId;
  private UUID courseId;
  private CourseDocumentDto courseDocument;
  private Object data;
}
