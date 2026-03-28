package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.course.InstructorPublicResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.model.Instructor;

public class InstructorMapper {
  private InstructorMapper() {
    throw new AssertionError("Utility class");
  }

  public static InstructorInfoResponse mapInstructorToInstructorInfoResponse(Instructor instructor) {
    if (instructor == null) return null;

    InstructorInfoResponse response = new InstructorInfoResponse();
    response.setNickname(instructor.getNickname());
    response.setJobTitle(instructor.getJobTitle());
    response.setBio(instructor.getBio());
    response.setTotalCourses(instructor.getCourses().size());
    response.setTotalStudents(instructor.getTotalStudent());
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
