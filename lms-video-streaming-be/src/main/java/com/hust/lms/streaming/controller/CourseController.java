package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.response.course.CourseAuthDetailsResponse;
import com.hust.lms.streaming.service.CourseService;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("courses")
@RequiredArgsConstructor
public class CourseController {
  private final CourseService courseService;

  @GetMapping("{slug}/details")
  public ResponseEntity<BaseResponse<?>> getCourseDetails(@PathVariable("slug") String slug) {
    CourseAuthDetailsResponse res = this.courseService.getCourseDetails(slug);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("OK")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }
}
