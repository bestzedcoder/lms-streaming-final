package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.user.ProfileUpdatingRequest;
import com.hust.lms.streaming.dto.response.user.UserProfileResponse;
import com.hust.lms.streaming.service.ProfileService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("profile")
public class ProfileController {
  private final ProfileService profileService;

  @GetMapping("me")
  public ResponseEntity<BaseResponse<?>> me() {
    UserProfileResponse res = this.profileService.me();
    return ResponseEntity.ok(BaseResponse.builder()
            .code(HttpStatus.OK.value())
            .success(true)
            .message("Lấy thông tin profile thành công!")
            .data(res)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("me")
  public ResponseEntity<BaseResponse<?>> updateProfile(@RequestBody @Valid ProfileUpdatingRequest req) {
    this.profileService.profile(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(HttpStatus.OK.value())
            .success(true)
            .message("Cập nhật profile thành công!")
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("upload")
  public ResponseEntity<BaseResponse<?>> uploadAvatar(@RequestPart("file") MultipartFile file) {
      this.profileService.upload(file);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(HttpStatus.OK.value())
        .success(true)
        .message("Cập nhật avatar thành công!")
        .timestamp(LocalDateTime.now())
        .build());
  }
}
