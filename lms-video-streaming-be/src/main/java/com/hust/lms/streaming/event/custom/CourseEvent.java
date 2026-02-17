package com.hust.lms.streaming.event.custom;

import com.hust.lms.streaming.event.enums.CourseEventType;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CourseEvent<T> {
  private CourseEventType type;
  private UUID instructorId;
  private UUID courseId;
  private T data;
}
