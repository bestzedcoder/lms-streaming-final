package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.user.ProfileUpdatingRequest;
import com.hust.lms.streaming.dto.response.user.UserProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {
  void upload(MultipartFile file);
  void profile(ProfileUpdatingRequest request);
  UserProfileResponse me();
}
