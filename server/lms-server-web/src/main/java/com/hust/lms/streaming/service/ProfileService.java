package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.user.ProfileUpdatingRequest;
import com.hust.lms.streaming.dto.response.user.UserCourseResponse;
import com.hust.lms.streaming.dto.response.user.UserProfileResponse;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {
  String upload(MultipartFile file);
  void profile(ProfileUpdatingRequest request);
  UserProfileResponse me();
  List<UserCourseResponse> getCourseMe();
}
