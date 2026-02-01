package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.user.LockAccountRequest;
import com.hust.lms.streaming.dto.request.user.UnlockAccountRequest;
import com.hust.lms.streaming.dto.request.user.UserCreatingRequest;
import com.hust.lms.streaming.dto.request.user.UserUpdatingRequest;
import com.hust.lms.streaming.dto.response.user.UserResponse;
import java.util.List;
import java.util.UUID;

public interface UserService {
  List<UserResponse> findAll();
  UserResponse findById(UUID id);
  void create(UserCreatingRequest request);
  void update(UUID uuid ,UserUpdatingRequest request);
  void delete(UUID uuid);

  void lock(LockAccountRequest request);
  void unlock(UnlockAccountRequest request);
}
