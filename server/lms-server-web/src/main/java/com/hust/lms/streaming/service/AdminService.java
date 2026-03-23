package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.common.PageResponse;
import com.hust.lms.streaming.dto.request.auth.LoginRequest;
import com.hust.lms.streaming.dto.response.admin.CourseOfInstructorResponse;
import com.hust.lms.streaming.dto.response.admin.CoursePendingResponse;
import com.hust.lms.streaming.dto.response.admin.InstructorResponse;
import com.hust.lms.streaming.dto.response.admin.SummaryDashboardResponse;
import com.hust.lms.streaming.dto.response.auth.AdminResponse;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.UUID;

public interface AdminService {

  // handle report


  // manage courses

  void approve(UUID courseId);

  List<CoursePendingResponse> getCoursesPending();

  Integer getCoursesPendingCount();

  PageResponse<InstructorResponse> getAllInstructor(int page, int limit, String email);

  void lockCourse(UUID courseId);

  void unlockCourse(UUID courseId);

  List<CourseOfInstructorResponse> getCoursesOfInstructor(UUID instructorId);

  // Summary

  SummaryDashboardResponse getSummaryDashboard();

  // Auth Admin

  AdminResponse login(LoginRequest data, HttpServletResponse response);

  void logout(HttpServletResponse response);

  AdminResponse checkAdmin();

}
