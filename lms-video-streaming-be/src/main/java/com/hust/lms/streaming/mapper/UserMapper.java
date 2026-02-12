package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.user.UserCourseResponse;
import com.hust.lms.streaming.dto.response.user.UserProfileResponse;
import com.hust.lms.streaming.dto.response.user.UserPublicResponse;
import com.hust.lms.streaming.dto.response.user.UserResponse;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.User;

public class UserMapper {

  private UserMapper() {
    throw new AssertionError("Utility class");
  }

  public static UserResponse mapUserToUserResponse(User user) {
    if (user == null) return null;

    UserResponse response = new UserResponse();
    response.setId(user.getId());
    response.setEmail(user.getEmail());
    response.setFullName(user.getFullName());
    response.setPhone(user.getPhone());
    response.setAvatarUrl(user.getAvatarUrl());
    response.setRole(user.getRole());
    response.setLockReason(user.getLockReason());
    response.setActive(user.isEnabled());
    response.setLocked(user.getLocked());
    response.setUpdateProfile(user.getUpdateProfile());
    response.setUpdatedAt(user.getUpdatedAt());
    response.setUpdatedBy(user.getUpdatedBy());
    response.setCreatedAt(user.getCreatedAt());
    response.setCreatedBy(user.getCreatedBy());
    return response;
  }

  public static UserProfileResponse mapUserToUserProfileResponse(User user) {
    if (user == null) return null;

    UserProfileResponse response = new UserProfileResponse();
    response.setId(user.getId());
    response.setFullName(user.getFullName());
    response.setEmail(user.getEmail());
    response.setPhone(user.getPhone());
    response.setAvatarUrl(user.getAvatarUrl());
    response.setRole(user.getRole());
    response.setUpdateProfile(user.getUpdateProfile());
    return response;
  }

  public static UserPublicResponse mapUserToUserPublicResponse(User user) {
    if (user == null) return null;

    UserPublicResponse response = new UserPublicResponse();
    response.setId(user.getId());
    response.setFullName(user.getFullName());
    response.setEmail(user.getEmail());
    response.setAvatarUrl(user.getAvatarUrl());
    return response;
  }

  public static UserCourseResponse mapCourseToUserCourseResponse(Course course) {
    if (course == null) return null;
    UserCourseResponse response = new UserCourseResponse();
    response.setId(course.getId());
    response.setSlug(course.getSlug());
    response.setTitle(course.getTitle());
    response.setDescription(course.getDescription());
    response.setPrice(course.getPrice());
    response.setSalePrice(course.getSalePrice());
    response.setThumbnail(course.getThumbnail());
    return response;
  }
}
