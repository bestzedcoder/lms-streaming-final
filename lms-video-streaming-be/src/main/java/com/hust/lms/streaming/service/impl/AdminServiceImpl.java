package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.event.custom.CourseEvent;
import com.hust.lms.streaming.event.enums.CourseEventType;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.service.AdminService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
  private final CourseRepository courseRepository;
  private final ApplicationEventPublisher eventPublisher;




  @Override
  public void approve(UUID courseId) {
    Course course = this.courseRepository.findById(courseId).orElse(null);
    if (course == null || !course.getStatus().equals(CourseStatus.PENDING)) {
      return;
    }

    course.setStatus(CourseStatus.PRIVATE);
    this.courseRepository.save(course);
    this.eventPublisher.publishEvent(new CourseEvent(CourseEventType.APPROVED_COURSE, course.getInstructor().getId(), courseId, null, null));
  }
}
