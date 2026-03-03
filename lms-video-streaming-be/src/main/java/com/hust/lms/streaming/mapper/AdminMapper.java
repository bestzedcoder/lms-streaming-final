package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.admin.CoursePendingResponse;
import com.hust.lms.streaming.model.Course;

public class AdminMapper {
  private AdminMapper() {
    throw new AssertionError("Utility class");
  }

  public static CoursePendingResponse mapCourseToCoursePendingResponse(Course course) {
    CoursePendingResponse response = new CoursePendingResponse();
    response.setCourseId(course.getId());
    response.setTitle(course.getTitle());
    response.setDescription(course.getDescription());
    response.setThumbnail(course.getThumbnail());
    response.setInstructorName(course.getInstructor().getUser().getFullName());
    response.setInstructorEmail(course.getInstructor().getUser().getEmail());
    return response;
  }
}
