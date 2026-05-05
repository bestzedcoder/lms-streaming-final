package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.review.ReviewRequest;
import com.hust.lms.streaming.dto.response.review.ReviewResponse;

import java.util.List;

public interface ReviewService {
    void createReview(ReviewRequest request, String slug);
    void updateReview(ReviewRequest request, String slug);
    ReviewResponse getReview(String slug);
    List<ReviewResponse> getReviews(String slug);
}
