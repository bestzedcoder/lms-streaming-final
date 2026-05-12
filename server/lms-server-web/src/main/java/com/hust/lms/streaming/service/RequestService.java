package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.response.report.CourseRequestResponse;
import com.hust.lms.streaming.dto.response.report.InstructorRequestResponse;
import com.hust.lms.streaming.dto.response.report.RequestResponse;

import java.util.List;
import java.util.UUID;

public interface RequestService {
  void createRequestCourse(String slug, String message);
  void createRequestInstructor(String message);
  void handleInstructorRequest(UUID requestId);
  void handleCourseRequest(UUID requestId);

  int countInstructorRequests();
  int countCourseRequests();
  List<InstructorRequestResponse> getInstructorRequests();
  List<CourseRequestResponse> getCourseRequests();

  List<RequestResponse> getRequests();
}
