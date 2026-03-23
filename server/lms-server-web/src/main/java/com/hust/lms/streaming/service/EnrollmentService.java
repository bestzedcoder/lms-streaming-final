package com.hust.lms.streaming.service;

import java.util.UUID;

public interface EnrollmentService {
  void banEnrollment(UUID courseId, UUID userId, String reason);
  void activeEnrollment(UUID courseId, UUID userId);
}
