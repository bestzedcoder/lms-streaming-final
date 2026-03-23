package com.hust.lms.streaming.service;

import java.util.UUID;

public interface RequestService {
  void handleInstructorRequest(UUID requestId);
  void handleCourseRequest(UUID requestId);
}
