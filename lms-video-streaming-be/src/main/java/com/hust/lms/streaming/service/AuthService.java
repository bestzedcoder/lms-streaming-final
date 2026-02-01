package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.auth.SignUpRequest;
import com.hust.lms.streaming.dto.response.auth.LoginResponse;

public interface AuthService {
  LoginResponse login(String email, String password);
  void register(SignUpRequest signUpRequest);
}
