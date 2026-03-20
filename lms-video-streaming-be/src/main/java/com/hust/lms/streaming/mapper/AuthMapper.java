package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.auth.AdminResponse;
import com.hust.lms.streaming.dto.response.auth.LoginUserInfoResponse;
import com.hust.lms.streaming.model.User;

public class AuthMapper {
  private AuthMapper() {
    throw new AssertionError("Utility class");
  }


  public static LoginUserInfoResponse toLoginUserInfoResponse(User user) {
    if (user == null) return null;

    LoginUserInfoResponse response = new LoginUserInfoResponse();
    response.setId(user.getId());
    response.setEmail(user.getEmail());
    response.setFullName(user.getLastName() + " " + user.getFirstName());
    response.setAvatarUrl(user.getAvatarUrl());
    response.setRole(user.getRole());
    response.setUpdateProfile(user.getUpdateProfile());
    return response;
  }

  public static AdminResponse toAdminResponse(User user) {
    if (user == null) return null;

    AdminResponse response = new AdminResponse();
    response.setEmail(user.getEmail());
    response.setFullName(user.getLastName() + " " + user.getFirstName());
    return response;
  }
}
