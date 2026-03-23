package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.auth.ChangePasswordRequest;
import com.hust.lms.streaming.dto.request.auth.ForgotPasswordRequest;
import com.hust.lms.streaming.dto.request.auth.ResetPasswordRequest;
import com.hust.lms.streaming.dto.request.auth.SignUpRequest;
import com.hust.lms.streaming.dto.request.auth.VerifyAccountRequest;
import com.hust.lms.streaming.dto.response.auth.AdminResponse;
import com.hust.lms.streaming.dto.response.auth.LoginUserInfoResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
  LoginUserInfoResponse login(HttpServletResponse response,String email, String password);
  LoginUserInfoResponse getMe();
  void register(SignUpRequest signUpRequest);
  void verifyAccount(VerifyAccountRequest request);
  void forgotPassword(ForgotPasswordRequest request);
  void resetPassword(ResetPasswordRequest request);
  void refresh(HttpServletRequest request, HttpServletResponse response);
  void logout(HttpServletResponse response);
  void changePassword(ChangePasswordRequest request);
}
