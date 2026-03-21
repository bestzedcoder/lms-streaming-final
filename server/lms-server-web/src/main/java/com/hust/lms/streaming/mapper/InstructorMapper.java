package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.category.CategoryPublicResponse;
import com.hust.lms.streaming.dto.response.course.InstructorPublicResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseDetailsResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseInfoResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorLessonResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorSectionResponse;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.Lesson;
import com.hust.lms.streaming.model.Section;

public class InstructorMapper {
  private InstructorMapper() {
    throw new AssertionError("Utility class");
  }

  public static InstructorInfoResponse mapInstructorToInstructorInfoResponse(Instructor instructor) {
    if (instructor == null) return null;

    InstructorInfoResponse response = new InstructorInfoResponse();
    response.setJobTitle(instructor.getJobTitle());
    response.setBio(instructor.getBio());
    response.setTotalCourses(instructor.getCourses().size());
    response.setTotalStudents(instructor.getTotalStudent());
    response.setCreatedAt(instructor.getCreatedAt());
    response.setUpdatedAt(instructor.getUpdatedAt());
    return response;
  }

  public static InstructorPublicResponse mapInstructorToInstructorPublicResponse(Instructor instructor) {
    if (instructor == null)  return null;

    InstructorPublicResponse response = new InstructorPublicResponse();
    response.setNickname(instructor.getNickname());
    response.setBio(instructor.getBio());
    response.setAvatarUrl(instructor.getUser().getAvatarUrl());
    response.setTotalCourses(instructor.getCourses().size());
    response.setTotalStudents(instructor.getTotalStudent());
    return response;
  }
}
