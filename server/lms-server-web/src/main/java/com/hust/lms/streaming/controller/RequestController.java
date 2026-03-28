package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.report.InstructorRequest;
import com.hust.lms.streaming.service.RequestService;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/requests")
@RequiredArgsConstructor
public class RequestController {
  private final RequestService requestService;


  @PostMapping("instructor")
  public ResponseEntity<BaseResponse<?>> handleInstructorRequest(@RequestBody InstructorRequest request) {
    this.requestService.createRequestInstructor(request.getMessage());
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }
}
