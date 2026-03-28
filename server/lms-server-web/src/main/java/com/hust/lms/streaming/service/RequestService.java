package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.response.report.InstructorRequestResponse;
import java.util.List;
import java.util.UUID;

public interface RequestService {
  void createRequestCourse(UUID courseId, String message);
  void createRequestInstructor(String message);
  void handleInstructorRequest(UUID requestId);
  void handleCourseRequest(UUID requestId);

  int countInstructorRequests();
  List<InstructorRequestResponse> getInstructorRequests();
}
