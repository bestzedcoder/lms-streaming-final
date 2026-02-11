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
import java.util.UUID;
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

  @Override
  public void upload(MultipartFile file) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));

    if (currentUser.getAvatarUrl() != null) {
      this.cloudinaryService.deleteImage(currentUser.getPublicId());
    }
    CloudinaryUploadResult res = this.cloudinaryService.uploadImage(file, "users");
    currentUser.setAvatarUrl(res.getUrl());
    currentUser.setPublicId(res.getPublicId());
    this.userRepository.save(currentUser);
  }

  @Override
  public void profile(ProfileUpdatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));

    currentUser.setPhone(request.getPhone());
    currentUser.setFullName(request.getFullName());
    currentUser.setUpdateProfile(true);
    this.userRepository.save(currentUser);
    this.eventPublisher.publishEvent(new UserEvent(UserEventType.UPDATED, currentUser.getEmail()));
  }

  @Override
  public UserProfileResponse me() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));

    return UserMapper.mapUserToUserProfileResponse(currentUser);
  }
}
