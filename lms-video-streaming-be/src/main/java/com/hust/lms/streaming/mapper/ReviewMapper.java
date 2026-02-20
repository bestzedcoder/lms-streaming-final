package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.review.ReviewCourseResponse;
import com.hust.lms.streaming.dto.response.review.ReviewPublicResponse;
import com.hust.lms.streaming.dto.response.review.ReviewUserResponse;
import com.hust.lms.streaming.model.Review;
import com.hust.lms.streaming.model.User;

public class ReviewMapper {
  private ReviewMapper() {
    throw new AssertionError("Utility class");
  }

  public static ReviewCourseResponse mapReviewToReviewCourseResponse(Review review) {
    if (review == null) return null;

    ReviewCourseResponse response = new ReviewCourseResponse();
    response.setId(review.getId());
    response.setRate(review.getRating());
    response.setContent(review.getContent());
    response.setUser(ReviewMapper.mapUserToReviewUserResponse(review.getUser()));
    return response;
  }

  public static ReviewUserResponse mapUserToReviewUserResponse(User user) {
    if (user == null) return null;

    ReviewUserResponse response = new ReviewUserResponse();
    response.setEmail(user.getEmail());
    response.setAvatarUrl(user.getAvatarUrl());
    return response;
  }

  public static ReviewPublicResponse mapReviewToReviewPublicResponse(Review review) {
    if (review == null) return null;

    ReviewPublicResponse response = new ReviewPublicResponse();
    response.setContent(review.getContent());
    response.setRating(review.getRating());
    response.setUser(review.getUser().getFullName());
    return response;
  }
}
