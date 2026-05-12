package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.registration.RegistrationInstructorResponse;
import com.hust.lms.streaming.dto.response.registration.RegistrationResponse;
import com.hust.lms.streaming.model.Registration;

public class RegistrationMapper {
  private RegistrationMapper() {
    throw new AssertionError("Utility class");
  }

  public static RegistrationInstructorResponse toRegistrationInstructorResponse(Registration registration) {
    if (registration == null) return null;

    RegistrationInstructorResponse response = new RegistrationInstructorResponse();
    response.setId(registration.getId());
    response.setStatus(registration.getStatus());
    response.setCourse(CourseMapper.mapCourseToCoursePublicRegistrationResponse(registration.getCourse()));
    response.setStudent(UserMapper.mapUserToUserPublicResponse(registration.getStudent()));
    return response;
  }

  public static RegistrationResponse toRegistrationResponse(Registration registration) {
    if (registration == null) return null;

    RegistrationResponse response = new RegistrationResponse();
    response.setStatus(registration.getStatus());
    response.setStudentMessage(registration.getStudentMessage());
    response.setTeacherNote(registration.getTeacherNote());
    response.setCourse(CourseMapper.mapCourseToCoursePublicRegistrationResponse(registration.getCourse()));
    response.setResolvedAt(registration.getResolvedAt());
    return response;
  }
}
