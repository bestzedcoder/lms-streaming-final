package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.common.PageResponse;
import com.hust.lms.streaming.dto.request.user.LockAccountRequest;
import com.hust.lms.streaming.dto.request.user.UnlockAccountRequest;
import com.hust.lms.streaming.dto.request.user.UserCreatingRequest;
import com.hust.lms.streaming.dto.request.user.UserUpdatingRequest;
import com.hust.lms.streaming.dto.response.user.UserResponse;
import com.hust.lms.streaming.service.UserService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @GetMapping
  public ResponseEntity<PageResponse<?>> getUsers(
      @RequestParam(value = "page", defaultValue = "1") int page,
      @RequestParam(value = "limit", defaultValue = "10") int limit,
      @RequestParam(value = "email", required = false) String email) {
    PageResponse<UserResponse> res = this.userService.findAll(page, limit, email);
    return ResponseEntity.ok(res);
  }

  @GetMapping("{uuid}")
  public ResponseEntity<BaseResponse<?>> findById(@PathVariable("uuid") UUID uuid) {
    UserResponse res = this.userService.findById(uuid);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(HttpStatus.OK.value())
            .success(true)
            .message("Tìm người dùng thành công!")
            .data(res)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping
  public ResponseEntity<BaseResponse<?>> create(@RequestBody @Valid UserCreatingRequest req) {
    this.userService.create(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(HttpStatus.CREATED.value())
            .success(true)
            .message("Tạo người dùng thành công!")
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("lock")
  public ResponseEntity<BaseResponse<?>> lock(@RequestBody @Valid LockAccountRequest req) {
    this.userService.lock(req);
    return ResponseEntity.status(HttpStatus.OK).body(BaseResponse.builder()
            .code(HttpStatus.OK.value())
            .success(true)
            .message("Đã khóa tài khoản thành công!")
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("unlock")
  public ResponseEntity<BaseResponse<?>> lock(@RequestBody @Valid UnlockAccountRequest req) {
    this.userService.unlock(req);
    return ResponseEntity.status(HttpStatus.OK).body(BaseResponse.builder()
        .code(HttpStatus.OK.value())
        .success(true)
        .message("Đã mở khóa tài khoản thành công!")
        .timestamp(LocalDateTime.now())
        .build());
  }


  @PutMapping("{uuid}")
  public ResponseEntity<BaseResponse<?>> update(@PathVariable("uuid") UUID uuid ,@RequestBody @Valid UserUpdatingRequest req) {
    this.userService.update(uuid ,req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(HttpStatus.OK.value())
            .success(true)
            .message("Cập nhật thành công!")
            .timestamp(LocalDateTime.now())
        .build());
  }



  @DeleteMapping("{uuid}")
  public ResponseEntity<BaseResponse<?>> delete(@PathVariable("uuid") UUID uuid) {
    this.userService.delete(uuid);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(HttpStatus.OK.value())
            .success(true)
            .message("Xóa người dùng thành công!")
            .timestamp(LocalDateTime.now())
        .build());
  }
}
