package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.auth.LoginRequest;
import com.hust.lms.streaming.dto.request.auth.SignUpRequest;
import com.hust.lms.streaming.dto.response.auth.LoginResponse;
import com.hust.lms.streaming.service.AuthService;
import jakarta.validation.Valid;
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
  public ResponseEntity<BaseResponse<?>> login(@RequestBody @Valid LoginRequest req) {
    LoginResponse res = this.authService.login(req.getEmail() , req.getPassword());
    return ResponseEntity.ok(BaseResponse.builder()
            .message("login thành công!")
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
            .message("Tạo tài khoản thành công!")
            .success(true)
            .data(null)
            .timestamp(LocalDateTime.now())
        .build());
  }
}
