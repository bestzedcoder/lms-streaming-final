package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.auth.ForgotPasswordRequest;
import com.hust.lms.streaming.dto.request.auth.RefreshRequest;
import com.hust.lms.streaming.dto.request.auth.ResetPasswordRequest;
import com.hust.lms.streaming.dto.request.auth.SignUpRequest;
import com.hust.lms.streaming.dto.request.auth.VerifyAccountRequest;
import com.hust.lms.streaming.dto.response.auth.LoginResponse;

public interface AuthService {
  LoginResponse login(String email, String password);
  void register(SignUpRequest signUpRequest);
  void verifyAccount(VerifyAccountRequest request);
  void forgotPassword(ForgotPasswordRequest request);
  void resetPassword(ResetPasswordRequest request);
  String refresh(RefreshRequest request);
  void logout();
}
