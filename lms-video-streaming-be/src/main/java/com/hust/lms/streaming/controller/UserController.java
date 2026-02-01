package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseListResponse;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.service.UserService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @GetMapping
  public ResponseEntity<BaseListResponse<?>> getUsers() {
    List<User> res = this.userService.findAll();
    return ResponseEntity.ok(BaseListResponse.<User>builder()
            .code(HttpStatus.OK.value())
            .success(true)
            .data(res)
            .message("Lấy danh sách người dùng thành công!")
            .timestamp(LocalDateTime.now())
        .build());
  }
}
