package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseListResponse;
import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.common.PageResponse;
import com.hust.lms.streaming.dto.request.auth.LoginRequest;
import com.hust.lms.streaming.dto.request.category.CategoryCreatingRequest;
import com.hust.lms.streaming.dto.request.category.CategoryUpdatingRequest;
import com.hust.lms.streaming.dto.request.user.LockAccountRequest;
import com.hust.lms.streaming.dto.request.user.UnlockAccountRequest;
import com.hust.lms.streaming.dto.request.user.UserCreatingRequest;
import com.hust.lms.streaming.dto.request.user.UserUpdatingRequest;
import com.hust.lms.streaming.dto.response.category.CategoryResponse;
import com.hust.lms.streaming.dto.response.user.UserResponse;
import com.hust.lms.streaming.service.AdminService;
import com.hust.lms.streaming.service.CategoryService;
import com.hust.lms.streaming.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {
  private final AdminService adminService;
  private final UserService userService;
  private final CategoryService categoryService;

  @PostMapping("login")
  public ResponseEntity<BaseResponse<?>> login(
      @RequestBody @Valid LoginRequest data,
      @NotNull HttpServletResponse response) {
    this.adminService.login(data, response);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("logout")
  public ResponseEntity<BaseResponse<?>> logout(
      @NotNull HttpServletResponse response
  ) {
    this.adminService.logout(response);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  // Course
  @PostMapping("approve-course/{uuid}")
  public ResponseEntity<BaseResponse<?>> approveCourse(@PathVariable("uuid") UUID courseId) {
    this.adminService.approve(courseId);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .data("Khóa học được phê duyệt thành công")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  // User

  @GetMapping("users")
  public ResponseEntity<BaseResponse<?>> getUsers(
      @RequestParam(value = "page", defaultValue = "1") int page,
      @RequestParam(value = "limit", defaultValue = "10") int limit,
      @RequestParam(value = "email", required = false) String email) {
    PageResponse<UserResponse> res = this.userService.findAll(page, limit, email);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(HttpStatus.OK.value())
        .message("Lấy danh sách người dùng thành công!")
        .data(res)
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("users/{uuid}")
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

  @PostMapping("users")
  public ResponseEntity<BaseResponse<?>> create(@RequestBody @Valid UserCreatingRequest req) {
    this.userService.create(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
        .code(HttpStatus.CREATED.value())
        .success(true)
        .message("Tạo người dùng thành công!")
        .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("users/lock")
  public ResponseEntity<BaseResponse<?>> lock(@RequestBody @Valid LockAccountRequest req) {
    this.userService.lock(req);
    return ResponseEntity.status(HttpStatus.OK).body(BaseResponse.builder()
        .code(HttpStatus.OK.value())
        .success(true)
        .message("Đã khóa tài khoản thành công!")
        .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("users/unlock")
  public ResponseEntity<BaseResponse<?>> unlock(@RequestBody @Valid UnlockAccountRequest req) {
    this.userService.unlock(req);
    return ResponseEntity.status(HttpStatus.OK).body(BaseResponse.builder()
        .code(HttpStatus.OK.value())
        .success(true)
        .message("Đã mở khóa tài khoản thành công!")
        .timestamp(LocalDateTime.now())
        .build());
  }


  @PostMapping("users/{uuid}")
  public ResponseEntity<BaseResponse<?>> update(@PathVariable("uuid") UUID uuid ,@RequestBody @Valid UserUpdatingRequest req) {
    this.userService.update(uuid ,req);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(HttpStatus.OK.value())
        .success(true)
        .message("Cập nhật thành công!")
        .timestamp(LocalDateTime.now())
        .build());
  }



  @DeleteMapping("users/{uuid}")
  public ResponseEntity<BaseResponse<?>> deleteUser(@PathVariable("uuid") UUID uuid) {
    this.userService.delete(uuid);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(HttpStatus.OK.value())
        .success(true)
        .message("Xóa người dùng thành công!")
        .timestamp(LocalDateTime.now())
        .build());
  }

  // Category

  @GetMapping("categories")
  public ResponseEntity<BaseListResponse<?>> findAll() {
    List<CategoryResponse> categories = this.categoryService.findAll();
    return ResponseEntity.ok(BaseListResponse.<CategoryResponse>builder()
        .code(200)
        .data(categories)
        .message("Thông tin chi tiết các danh mục!")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }


  @PostMapping("categories/{uuid}")
  public ResponseEntity<BaseResponse<?>> update(@PathVariable("uuid") UUID id ,@RequestBody @Valid CategoryUpdatingRequest req) {
    this.categoryService.update(id ,req);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Cập nhật danh mục thành công!")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("categories")
  public ResponseEntity<BaseResponse<?>> create(@RequestBody @Valid CategoryCreatingRequest req) {
    this.categoryService.create(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
        .code(201)
        .message("Tạo danh mục thành công!")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @DeleteMapping("categories/{uuid}")
  public ResponseEntity<BaseResponse<?>> deleteCategory(@PathVariable("uuid") UUID id) {
    this.categoryService.delete(id);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Xóa danh mục thành công!")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

}
