package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.exception.AdminException;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("admin")
@RequiredArgsConstructor
public class AdminController {
  private final UserRepository userRepository;

  @GetMapping("check-auth")
  public ResponseEntity<BaseResponse<?>> checkAuth() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    User user = this.userRepository.getReferenceById(UUID.fromString(authId));
    if (user.getRole().equals(Role.ADMIN)) {
      return ResponseEntity.ok(BaseResponse.builder()
              .code(200)
              .message("OK")
              .success(true)
              .timestamp(LocalDateTime.now())
          .build());
    }
    throw new AdminException("Truy cập không hợp lệ vui lòng đăng nhập lại.");
  }
}
