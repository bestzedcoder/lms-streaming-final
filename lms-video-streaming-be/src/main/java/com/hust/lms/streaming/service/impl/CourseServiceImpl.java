package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.response.course.CourseAuthDetailsResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.mapper.CourseMapper;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.service.CourseService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
  private final CourseRepository courseRepository;

  @Override
  public CourseAuthDetailsResponse getCourseDetails(String slug) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Course course = this.courseRepository.findBySlugAndStatus(slug, CourseStatus.PUBLISHED).orElse(null);

    boolean hasAccess = false;
    if (course != null) {
      hasAccess = course.getEnrollments().stream().anyMatch(enrollment -> enrollment.getUser().getId().equals(
          UUID.fromString(authId)));
    }
    return CourseMapper.mapCourseToCourseAuthDetailsResponse(course, hasAccess);
  }

}
