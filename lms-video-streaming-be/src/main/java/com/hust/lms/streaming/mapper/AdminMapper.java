package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.admin.CourseOfInstructorResponse;
import com.hust.lms.streaming.dto.response.admin.CoursePendingResponse;
import com.hust.lms.streaming.dto.response.admin.InstructorResponse;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
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
    response.setNickname(course.getInstructor().getNickname());
    response.setInstructorPhone(course.getInstructor().getUser().getPhone());
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
    response.setTotalStudents(course.getEnrollments().size());
    return response;
  }

  public static InstructorResponse mapUserToInstructorResponse(Instructor instructor, int totalCourses, int totalStudents) {
    InstructorResponse response = new InstructorResponse();
    response.setInstructorId(instructor.getId());
    response.setEmail(instructor.getUser().getEmail());
    response.setNickname(instructor.getNickname());
    response.setPhoneNumber(instructor.getUser().getPhone());
    response.setTotalCourses(totalCourses);
    response.setTotalStudents(totalStudents);
    return response;
  }
}
