package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.auth.LoginResponse;
import com.hust.lms.streaming.dto.response.auth.LoginUserInfoResponse;
import com.hust.lms.streaming.model.User;

public class AuthMapper {
  private AuthMapper() {
    throw new AssertionError("Utility class");
  }

  public static LoginResponse toLoginResponse(String accessToken, User user) {
    if (accessToken.isEmpty() || user == null) return null;

    LoginResponse response = new LoginResponse();
    response.setAccessToken(accessToken);
    response.setUser(AuthMapper.toLoginUserInfoResponse(user));
    return response;
  }

  public static LoginUserInfoResponse toLoginUserInfoResponse(User user) {
    if (user == null) return null;

    LoginUserInfoResponse response = new LoginUserInfoResponse();
    response.setId(user.getId());
    response.setEmail(user.getEmail());
    response.setFullName(user.getFullName());
    response.setAvatarUrl(user.getAvatarUrl());
    response.setRole(user.getRole());
    response.setUpdateProfile(user.getUpdateProfile());
    return response;
  }
}
