package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.response.registration.RegistrationInstructorResponse;
import com.hust.lms.streaming.dto.response.registration.RegistrationResponse;

import java.util.List;
import java.util.UUID;

public interface RegistrationService {
  void enrollCourse(String slug, String message);
  void approveRegistration(UUID registrationId, String message);
  void rejectRegistration(UUID registrationId, String message);
  List<RegistrationInstructorResponse> getPendingRegistrationsByInstructor();
  int countPendingRegistrationsByInstructor();

  List<RegistrationResponse> getRegistrationsByStudent();
}
