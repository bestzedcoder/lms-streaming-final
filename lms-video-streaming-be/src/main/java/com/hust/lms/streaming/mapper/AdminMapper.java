package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.admin.CourseOfInstructorResponse;
import com.hust.lms.streaming.dto.response.admin.CoursePendingResponse;
import com.hust.lms.streaming.dto.response.admin.InstructorResponse;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.User;

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

  public static CourseOfInstructorResponse mapCourseToCourseOfInstructorResponse(Course course) {
    CourseOfInstructorResponse response = new CourseOfInstructorResponse();
    response.setCourseId(course.getId());
    response.setTitle(course.getTitle());
    response.setCategory(course.getCategory().getName());
    response.setStatus(course.getStatus());
    response.setSlug(course.getSlug());
    response.setPrice(course.getSalePrice() != null ? course.getPrice().subtract(course.getSalePrice()) : course.getPrice());
    response.setCountStudents(course.getEnrollments().size());
    return response;
  }

  public static InstructorResponse mapUserToInstructorResponse(User user, long countCourses, long countStudents) {
    InstructorResponse response = new InstructorResponse();
    response.setInstructorId(user.getId());
    response.setEmail(user.getEmail());
    response.setFullName(user.getFullName());
    response.setPhoneNumber(user.getPhone());
    response.setCountCourses(countCourses);
    response.setCountStudents(countStudents);
    return response;
  }
}
