package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.service.StreamingService;
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
@RequestMapping("api/streaming")
public class StreamingController {
    private final StreamingService streamingService;

    @GetMapping("course/{courseId}/video/{videoId}")
    public ResponseEntity<BaseResponse<?>> streaming(@PathVariable UUID courseId, @PathVariable UUID videoId) {
        String res = this.streamingService.start(videoId, courseId);
        return ResponseEntity.ok(BaseResponse.builder()
                        .code(200)
                        .message("Success")
                        .data(res)
                        .success(true)
                        .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("test/video/{videoId}")
    public ResponseEntity<BaseResponse<?>> streamingTest(@PathVariable UUID videoId) {
        String res = this.streamingService.startTest(videoId);
        return ResponseEntity.ok(BaseResponse.builder()
                .code(200)
                .message("Success")
                .data(res)
                .success(true)
                .timestamp(LocalDateTime.now())
                .build());
    }
}
