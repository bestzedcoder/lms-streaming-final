package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.registration.RegistrationCreatingRequest;
import com.hust.lms.streaming.service.RegistrationService;
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
@RequestMapping("api/registrations")
@RequiredArgsConstructor
public class RegistrationController {
  private final RegistrationService registrationService;

  @PostMapping
  public ResponseEntity<BaseResponse<?>> registration(@RequestBody @Valid RegistrationCreatingRequest request) {
    this.registrationService.enrollCourse(request.getSlug(), request.getMessage());
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(HttpStatus.CREATED.value())
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }
}
