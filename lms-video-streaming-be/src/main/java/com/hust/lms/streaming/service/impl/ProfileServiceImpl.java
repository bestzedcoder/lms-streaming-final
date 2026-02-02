package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.request.user.ProfileUpdatingRequest;
import com.hust.lms.streaming.dto.response.user.UserProfileResponse;
import com.hust.lms.streaming.event.custom.UserEvent;
import com.hust.lms.streaming.event.enums.UserEventType;
import com.hust.lms.streaming.mapper.UserMapper;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.UserRepository;
import com.hust.lms.streaming.service.ProfileService;
import com.hust.lms.streaming.upload.CloudinaryService;
import com.hust.lms.streaming.upload.CloudinaryUploadResult;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
  private final UserRepository userRepository;
  private final ApplicationEventPublisher eventPublisher;
  private final CloudinaryService cloudinaryService;
  private final UserMapper userMapper;

  @Override
  public void upload(MultipartFile file) {
    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (user.getAvatarUrl() != null) {
      this.cloudinaryService.deleteImage(user.getPublicId());
    }
    CloudinaryUploadResult res = this.cloudinaryService.uploadImage(file, "users");
    user.setAvatarUrl(res.getUrl());
    user.setPublicId(res.getPublicId());
    this.userRepository.save(user);
  }

  @Override
  public void profile(ProfileUpdatingRequest request) {
    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    user.setPhone(request.getPhone());
    user.setFullName(request.getFullName());
    user.setUpdateProfile(true);
    this.userRepository.save(user);
    this.eventPublisher.publishEvent(new UserEvent(UserEventType.UPDATED, user.getEmail()));
  }

  @Override
  public UserProfileResponse me() {
    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    return this.userMapper.mapUserToUserProfileResponse(user);
  }
}
