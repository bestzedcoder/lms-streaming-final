package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseListResponse;
import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.report.InstructorAndCourseRequest;
import com.hust.lms.streaming.dto.response.report.RequestResponse;
import com.hust.lms.streaming.service.RequestService;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/requests")
@RequiredArgsConstructor
public class RequestController {
  private final RequestService requestService;

  @GetMapping
  public ResponseEntity<BaseListResponse<?>> get() {
    List<RequestResponse> res = this.requestService.getRequests();
    return ResponseEntity.ok(BaseListResponse.<RequestResponse>builder()
                    .code(200)
                    .message("Success")
                    .data(res)
                    .success(true)
                    .timestamp(LocalDateTime.now())
            .build());
  }

  @PostMapping("instructor")
  public ResponseEntity<BaseResponse<?>> handleInstructorRequest(@RequestBody @Valid InstructorAndCourseRequest request) {
    this.requestService.createRequestInstructor(request.getMessage());
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("course/{slug}")
  public ResponseEntity<BaseResponse<?>> handleCourseRequest(@PathVariable String slug, @RequestBody @Valid InstructorAndCourseRequest request) {
    this.requestService.createRequestCourse(slug, request.getMessage());
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }
}
