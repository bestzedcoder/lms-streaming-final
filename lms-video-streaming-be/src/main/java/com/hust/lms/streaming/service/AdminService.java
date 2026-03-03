package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.auth.LoginRequest;
import com.hust.lms.streaming.dto.response.admin.CoursePendingResponse;
import com.hust.lms.streaming.dto.response.auth.AdminResponse;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.UUID;

public interface AdminService {
  void approve(UUID courseId);

  AdminResponse login(LoginRequest data, HttpServletResponse response);

  void logout(HttpServletResponse response);

  List<CoursePendingResponse> getCoursesPending();

  Integer getCoursesPendingCount();
}
