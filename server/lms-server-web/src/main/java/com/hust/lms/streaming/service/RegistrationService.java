package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.response.registration.RegistrationResponse;
import java.util.List;
import java.util.UUID;

public interface RegistrationService {
  void enrollCourse(String slug, String message);
  void approveRegistration(UUID registrationId, String message);
  void rejectRegistration(UUID registrationId, String message);
  List<RegistrationResponse> getPendingRegistrationsByUser();
  int countPendingRegistrationsByInstructor();
}
