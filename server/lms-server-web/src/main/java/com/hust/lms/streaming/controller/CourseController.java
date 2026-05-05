package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseListResponse;
import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.quiz.QuizSubmissionRequest;
import com.hust.lms.streaming.dto.response.course.CourseAuthDetailsResponse;
import com.hust.lms.streaming.dto.response.course.CourseEnrollmentDetailsResponse;
import com.hust.lms.streaming.dto.response.course.CourseEnrollmentResponse;
import com.hust.lms.streaming.dto.response.course.LessonLearningResponse;
import com.hust.lms.streaming.dto.response.quiz.QuizResultResponse;
import com.hust.lms.streaming.service.CourseService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.hust.lms.streaming.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/courses")
@RequiredArgsConstructor
public class CourseController {
  private final CourseService courseService;
  private final QuizService quizService;

  @GetMapping("{slug}/details")
  public ResponseEntity<BaseResponse<?>> getCourseDetails(@PathVariable String slug) {
    CourseAuthDetailsResponse res = this.courseService.getCourseDetails(slug);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("OK")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("my-courses")
  public ResponseEntity<BaseListResponse<?>> getCoursesByStudent() {
    List<CourseEnrollmentResponse> res = this.courseService.getCoursesByStudent();
    return ResponseEntity.ok(BaseListResponse.<CourseEnrollmentResponse>builder()
            .code(200)
            .message("OK")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }

  @GetMapping("learning/{slug}/details")
  public ResponseEntity<BaseResponse<?>> getCourseByStudent(@PathVariable String slug) {
    CourseEnrollmentDetailsResponse res = this.courseService.getCourseByStudent(slug);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("OK")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }

  @GetMapping("learning/{slug}/quiz-result")
  public ResponseEntity<BaseListResponse<?>> getQuizResult(@PathVariable String slug) {
    List<QuizResultResponse> res = this.quizService.getQuizSubmission(slug);
    return ResponseEntity.ok(BaseListResponse.<QuizResultResponse>builder()
            .code(200)
            .message("OK")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }

  @GetMapping("learning/{slug}/lesson/{id}")
  public ResponseEntity<BaseResponse<?>> learning(@PathVariable String slug, @PathVariable("id") UUID lessonId) {
    LessonLearningResponse res = this.courseService.learningStart(slug, lessonId);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("OK")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }

  @PostMapping("learning/{slug}/submit-quiz")
  public ResponseEntity<BaseResponse<?>> submitQuiz(@PathVariable String slug, @RequestBody @Valid QuizSubmissionRequest req) {
    Integer res = this.quizService.submitQuiz(req, slug);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("OK")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }
}
