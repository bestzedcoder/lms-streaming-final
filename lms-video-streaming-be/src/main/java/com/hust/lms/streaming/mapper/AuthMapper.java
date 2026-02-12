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
    LoginUserInfoResponse userInfoResponse = new LoginUserInfoResponse();
    userInfoResponse.setId(user.getId());
    userInfoResponse.setEmail(user.getEmail());
    userInfoResponse.setFullName(user.getFullName());
    userInfoResponse.setAvatarUrl(user.getAvatarUrl());
    userInfoResponse.setRole(user.getRole());
    userInfoResponse.setUpdateProfile(user.getUpdateProfile());
    response.setUser(userInfoResponse);
    return response;
  }
}
