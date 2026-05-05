package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.response.quiz.QuizLearningResponse;
import com.hust.lms.streaming.service.LearningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/learning")
public class LearningController {
    private final LearningService learningService;

    @GetMapping("course/{slug}/video/{id}")
    public ResponseEntity<BaseResponse<?>> learnVideo(@PathVariable String slug, @PathVariable("id") UUID lessonId) {
        String res = this.learningService.learnVideo(slug, lessonId);
        return ResponseEntity.ok(BaseResponse.builder()
                        .code(200)
                        .message("Success")
                        .data(res)
                        .success(true)
                        .timestamp(LocalDateTime.now())
                .build());
    }


    @GetMapping("course/{slug}/lecture/{id}")
    public ResponseEntity<BaseResponse<?>> learnLecture(@PathVariable String slug, @PathVariable("id") UUID lessonId) {
        String res = this.learningService.learnLecture(slug, lessonId);
        return ResponseEntity.ok(BaseResponse.builder()
                .code(200)
                .message("Success")
                .data(res)
                .success(true)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("course/{slug}/quiz/{id}")
    public ResponseEntity<BaseResponse<?>> learnQuiz(@PathVariable String slug, @PathVariable("id") UUID lessonId) {
        QuizLearningResponse res = this.learningService.learnQuiz(slug, lessonId);
        return ResponseEntity.ok(BaseResponse.builder()
                .code(200)
                .message("Success")
                .data(res)
                .success(true)
                .timestamp(LocalDateTime.now())
                .build());
    }
}
