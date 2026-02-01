package com.hust.lms.streaming.mapper;

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
}
