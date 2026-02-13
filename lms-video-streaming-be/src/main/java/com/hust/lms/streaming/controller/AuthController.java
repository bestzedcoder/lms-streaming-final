package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.auth.ChangePasswordRequest;
import com.hust.lms.streaming.dto.request.auth.ForgotPasswordRequest;
import com.hust.lms.streaming.dto.request.auth.LoginRequest;
import com.hust.lms.streaming.dto.request.auth.ResetPasswordRequest;
import com.hust.lms.streaming.dto.request.auth.SignUpRequest;
import com.hust.lms.streaming.dto.request.auth.VerifyAccountRequest;
import com.hust.lms.streaming.dto.response.auth.LoginResponse;
import com.hust.lms.streaming.dto.response.auth.RefreshResponse;
import com.hust.lms.streaming.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthService authService;

  @PostMapping("login")
  public ResponseEntity<BaseResponse<?>> login(@RequestBody @Valid LoginRequest req, @NotNull HttpServletResponse response) {
    LoginResponse res = this.authService.login(response , req.getEmail() , req.getPassword());
    return ResponseEntity.ok(BaseResponse.builder()
            .message("Đăng nhập thành công!")
            .code(HttpStatus.OK.value())
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("register")
  public ResponseEntity<BaseResponse<?>> register(@RequestBody @Valid SignUpRequest req) {
    this.authService.register(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(HttpStatus.CREATED.value())
            .message("Tạo tài khoản thành công, hãy xác thực tài khoản!")
            .success(true)
            .data(null)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("verify-account")
  public ResponseEntity<BaseResponse<?>> verifyAccount(@RequestBody @Valid VerifyAccountRequest req) {
    this.authService.verifyAccount(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(HttpStatus.OK.value())
            .success(true)
            .message("Kích hoạt tài khoản thành công!")
            .data(null)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("forgot-password")
  public ResponseEntity<BaseResponse<?>> forgotPassword(@RequestBody @Valid ForgotPasswordRequest req) {
    this.authService.forgotPassword(req);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(HttpStatus.OK.value())
        .success(true)
        .message("Hãy xác thực mã otp để reset mật khẩu!")
        .data(null)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("reset-password")
  public ResponseEntity<BaseResponse<?>> resetPassword(@RequestBody @Valid ResetPasswordRequest req) {
    this.authService.resetPassword(req);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(HttpStatus.OK.value())
        .success(true)
        .message("Xác thực tài khoản thành công, hãy vào mail để lấy mật khẩu mới!")
        .data(null)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("logout")
  public ResponseEntity<BaseResponse<?>> logout(@NotNull HttpServletResponse response) {
    this.authService.logout(response);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(HttpStatus.OK.value())
        .success(true)
        .message("Đăng xuất thành công!")
        .data(null)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("refresh")
  public ResponseEntity<BaseResponse<?>> refresh(@NotNull HttpServletRequest req) {
    RefreshResponse accessToken = this.authService.refresh(req);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(HttpStatus.OK.value())
        .success(true)
        .message("Refresh token thành công!")
        .data(accessToken)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("change-password")
  public ResponseEntity<BaseResponse<?>> changePassword(@RequestBody @Valid ChangePasswordRequest req) {
    this.authService.changePassword(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(HttpStatus.OK.value())
            .success(true)
            .message("Thay đổi mật khẩu thành công")
            .timestamp(LocalDateTime.now())
        .build());
  }
}
