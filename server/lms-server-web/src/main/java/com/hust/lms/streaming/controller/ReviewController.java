package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseListResponse;
import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.review.ReviewRequest;
import com.hust.lms.streaming.dto.response.review.ReviewResponse;
import com.hust.lms.streaming.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("course/{slug}/new")
    public ResponseEntity<BaseResponse<?>> createReview(@RequestBody @Valid ReviewRequest req, @PathVariable String slug) {
        this.reviewService.createReview(req, slug);
        return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
                        .code(201)
                        .success(true)
                        .message("Success")
                        .timestamp(LocalDateTime.now())
                .build());
    }

    @PostMapping("course/{slug}/update")
    public ResponseEntity<BaseResponse<?>> updateReview(@RequestBody @Valid ReviewRequest req, @PathVariable String slug) {
        this.reviewService.updateReview(req, slug);
        return ResponseEntity.ok(BaseResponse.builder()
                .code(200)
                .success(true)
                .message("Success")
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("course/{slug}/student")
    public ResponseEntity<BaseResponse<?>> getReview(@PathVariable String slug) {
        ReviewResponse res = this.reviewService.getReview(slug);
        return ResponseEntity.ok(BaseResponse.builder()
                .code(200)
                .success(true)
                .data(res)
                .message("Success")
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("course/{slug}/all")
    public ResponseEntity<BaseListResponse<?>> getReviews(@PathVariable String slug) {
        List<ReviewResponse> res = this.reviewService.getReviews(slug);
        return ResponseEntity.ok(BaseListResponse.<ReviewResponse>builder()
                .code(200)
                .success(true)
                .data(res)
                .message("Success")
                .timestamp(LocalDateTime.now())
                .build());
    }
}
