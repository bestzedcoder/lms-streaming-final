package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.request.user.LockAccountRequest;
import com.hust.lms.streaming.dto.request.user.UnlockAccountRequest;
import com.hust.lms.streaming.dto.request.user.UserCreatingRequest;
import com.hust.lms.streaming.dto.request.user.UserUpdatingRequest;
import com.hust.lms.streaming.dto.response.user.UserResponse;
import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.exception.ResourceNotFoundException;
import com.hust.lms.streaming.mapper.UserMapper;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.UserRepository;
import com.hust.lms.streaming.service.UserService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final UserMapper userMapper;

  @Override
  public List<UserResponse> findAll() {
    return this.userRepository.findAll().stream().map(this.userMapper::mapUserToUserResponse).toList();
  }

  @Override
  public UserResponse findById(UUID id) {
    User user = this.userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    return this.userMapper.mapUserToUserResponse(user);
  }


  @Override
  public void create(UserCreatingRequest request) {
    if (this.userRepository.existsByEmail(request.getEmail())) {
      throw new BadRequestException("Đã tồn tại user với email: " + request.getEmail());
    }

    if (request.getRole().equals(Role.ADMIN)) {
      throw new BadRequestException("Không được tạo tài khoản ADMIN");
    }

    User user = new User();
    user.setEmail(request.getEmail());
    user.setFullName(request.getFullName());
    user.setPassword(this.passwordEncoder.encode(request.getPassword()));
    user.setPhone(request.getPhone());
    user.setRole(request.getRole());
    user.setUpdateProfile(true);
    user.setEnabled(true);
    this.userRepository.save(user);
  }

  @Override
  public void update(UUID uuid, UserUpdatingRequest request) {
    User user = this.userRepository.findById(uuid).orElseThrow(() -> new ResourceNotFoundException("User", "id", uuid));
    user.setFullName(request.getFullName());
    user.setPhone(request.getPhone());
    this.userRepository.save(user);
  }

  @Override
  public void delete(UUID uuid) {
    User user = this.userRepository.findById(uuid).orElseThrow(() -> new ResourceNotFoundException("User", "id", uuid));
    if (user.getRole().equals(Role.ADMIN)) throw new BadRequestException("Không thể xóa tài khoản admin.");
    if (user.getAvatarUrl() != null) {
      // TO-DO: logic xóa ảnh
    }
    this.userRepository.delete(user);
  }

  @Override
  public void lock(LockAccountRequest request) {
    UUID uuid = UUID.fromString(request.getUuid());
    User user = this.userRepository.findById(uuid).orElseThrow(() -> new ResourceNotFoundException("User", "id", uuid));
    if (user.getRole().equals(Role.ADMIN)) throw new BadRequestException("Tài khoản admin không được phép khóa");
    user.setLocked(true);
    user.setLockReason(request.getReason());
    this.userRepository.save(user);
  }

  @Override
  public void unlock(UnlockAccountRequest request) {
    UUID uuid = UUID.fromString(request.getUuid());
    User user = this.userRepository.findById(uuid).orElseThrow(() -> new ResourceNotFoundException("User", "id", uuid));
    user.setLocked(false);
    this.userRepository.save(user);
  }
}
