package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.auth.ChangePasswordRequest;
import com.hust.lms.streaming.dto.request.auth.ForgotPasswordRequest;
import com.hust.lms.streaming.dto.request.auth.ResetPasswordRequest;
import com.hust.lms.streaming.dto.request.auth.SignUpRequest;
import com.hust.lms.streaming.dto.request.auth.VerifyAccountRequest;
import com.hust.lms.streaming.dto.response.auth.LoginResponse;
import com.hust.lms.streaming.dto.response.auth.RefreshResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
  LoginResponse login(HttpServletResponse response,String email, String password);
  void register(SignUpRequest signUpRequest);
  void verifyAccount(VerifyAccountRequest request);
  void forgotPassword(ForgotPasswordRequest request);
  void resetPassword(ResetPasswordRequest request);
  RefreshResponse refresh(HttpServletRequest request);
  void logout(HttpServletResponse response);
  void changePassword(ChangePasswordRequest request);
}
