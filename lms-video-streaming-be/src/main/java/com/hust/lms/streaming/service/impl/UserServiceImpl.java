package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.common.Gen;
import com.hust.lms.streaming.dto.common.PageResponse;
import com.hust.lms.streaming.dto.request.user.LockAccountRequest;
import com.hust.lms.streaming.dto.request.user.UnlockAccountRequest;
import com.hust.lms.streaming.dto.request.user.UserCreatingRequest;
import com.hust.lms.streaming.dto.request.user.UserUpdatingRequest;
import com.hust.lms.streaming.dto.response.user.UserResponse;
import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.event.custom.UserEvent;
import com.hust.lms.streaming.event.enums.UserEventType;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.exception.ResourceNotFoundException;
import com.hust.lms.streaming.mapper.UserMapper;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.UserRepository;
import com.hust.lms.streaming.service.UserService;
import com.hust.lms.streaming.upload.CloudinaryService;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final RedisService redisService;
  private final UserMapper userMapper;
  private final ApplicationEventPublisher eventPublisher;
  private final CloudinaryService cloudinaryService;

  @Override
  public PageResponse<UserResponse> findAll(int page, int limit, String email) {

    String key = String.format("lms:user:search:page:%d:limit:%d:email:%s", page, limit, email == null ? "" : email);

    PageResponse<UserResponse> dataCache = this.redisService.getValue(key, new TypeReference<PageResponse<UserResponse>>() {});
    if (dataCache != null) {
      return dataCache;
    }

    int pageNo = page > 0 ? page - 1 : 0;
    Pageable pageable = PageRequest.of(pageNo, limit, Sort.by("createdAt").descending());

    Page<User> userPage;
    if (email != null && !email.isBlank()) {
      userPage = this.userRepository.findByEmailContainingIgnoreCase(email, pageable);
    } else {
      userPage = this.userRepository.findAll(pageable);
    }

    List<UserResponse> items = userPage.getContent().stream()
        .map(this.userMapper::mapUserToUserResponse)
        .toList();

    PageResponse<UserResponse> response = PageResponse.<UserResponse>builder()
        .result(items)
        .currentPages(page)
        .pageSizes(limit)
        .totalElements(userPage.getTotalElements())
        .totalPages(userPage.getTotalPages())
        .build();

    this.redisService.saveKeyAndValue(key, response, 300, TimeUnit.SECONDS);

    return response;
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
    String rawPassword = Gen.genPasswordRaw(16);
    user.setPassword(this.passwordEncoder.encode(rawPassword));
    user.setPhone(request.getPhone());
    user.setRole(request.getRole());
    user.setUpdateProfile(true);
    user.setEnabled(true);
    this.userRepository.save(user);
    this.eventPublisher.publishEvent(new UserEvent(UserEventType.CREATED, user.getEmail() , rawPassword));
  }

  @Override
  public void update(UUID uuid, UserUpdatingRequest request) {
    User user = this.userRepository.findById(uuid).orElseThrow(() -> new ResourceNotFoundException("User", "id", uuid));
    if (user.getRole().equals(Role.ADMIN) || request.getRole().equals(Role.ADMIN)) {
      throw new BadRequestException("Tài khoản hoặc dữ liệu cập nhật không hợp lệ");
    }
    user.setRole(request.getRole());
    user.setFullName(request.getFullName());
    user.setPhone(request.getPhone());
    this.userRepository.save(user);
    this.eventPublisher.publishEvent(new UserEvent(UserEventType.UPDATED, user.getEmail()));
  }

  @Override
  public void delete(UUID uuid) {
    User user = this.userRepository.findById(uuid).orElseThrow(() -> new ResourceNotFoundException("User", "id", uuid));
    if (user.getRole().equals(Role.ADMIN)) throw new BadRequestException("Không thể xóa tài khoản admin.");
    if (user.getAvatarUrl() != null) {
      this.cloudinaryService.deleteImage(user.getPublicId());
    }
    this.userRepository.delete(user);
    this.eventPublisher.publishEvent(new UserEvent(UserEventType.DELETED, user.getEmail()));
  }

  @Override
  public void lock(LockAccountRequest request) {
    UUID uuid = UUID.fromString(request.getUuid());
    User user = this.userRepository.findById(uuid).orElseThrow(() -> new ResourceNotFoundException("User", "id", uuid));
    if (user.getRole().equals(Role.ADMIN)) throw new BadRequestException("Không thể thao tác lock và unlock với tài khoản admin");
    user.setLocked(true);
    user.setLockReason(request.getReason());
    this.userRepository.save(user);
    this.eventPublisher.publishEvent(new UserEvent(UserEventType.LOCKED, user.getEmail()));
  }

  @Override
  public void unlock(UnlockAccountRequest request) {
    UUID uuid = UUID.fromString(request.getUuid());
    User user = this.userRepository.findById(uuid).orElseThrow(() -> new ResourceNotFoundException("User", "id", uuid));
    if (user.getRole().equals(Role.ADMIN)) throw new BadRequestException("Không thể thao tác lock và unlock với tài khoản admin");
    user.setLocked(false);
    this.userRepository.save(user);
    this.eventPublisher.publishEvent(new UserEvent(UserEventType.UNLOCKED, user.getEmail()));
  }
}
