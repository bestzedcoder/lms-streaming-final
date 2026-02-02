package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.user.UserProfileResponse;
import com.hust.lms.streaming.dto.response.user.UserPublicResponse;
import com.hust.lms.streaming.dto.response.user.UserResponse;
import com.hust.lms.streaming.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
  public UserResponse mapUserToUserResponse(User user) {
    UserResponse response = new UserResponse();
    response.setUuid(user.getId().toString());
    response.setEmail(user.getEmail());
    response.setFullName(user.getFullName());
    response.setPhone(user.getPhone());
    response.setAvatarUrl(user.getAvatarUrl());
    response.setRole(user.getRole());
    response.setLockReason(user.getLockReason());
    response.setActive(user.isEnabled());
    response.setLocked(user.isLocked());
    response.setUpdateProfile(user.isUpdateProfile());
    return response;
  }

  public UserProfileResponse mapUserToUserProfileResponse(User user) {
    UserProfileResponse response = new UserProfileResponse();
    response.setUuid(user.getId().toString());
    response.setFullName(user.getFullName());
    response.setEmail(user.getEmail());
    response.setPhone(user.getPhone());
    response.setAvatarUrl(user.getAvatarUrl());
    response.setRole(user.getRole());
    response.setUpdateProfile(user.isUpdateProfile());
    return response;
  }

  public UserPublicResponse mapUserToUserPublicResponse(User user) {
    UserPublicResponse response = new UserPublicResponse();
    response.setUuid(user.getId().toString());
    response.setFullName(user.getFullName());
    response.setEmail(user.getEmail());
    response.setAvatarUrl(user.getAvatarUrl());
    return response;
  }
}
