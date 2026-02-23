package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.service.AdminService;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("admin")
@RequiredArgsConstructor
public class AdminController {
  private final AdminService adminService;

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

}
