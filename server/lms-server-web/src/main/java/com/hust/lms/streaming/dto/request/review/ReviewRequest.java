package com.hust.lms.streaming.dto.request.review;

import com.hust.lms.streaming.enums.ReviewRate;
import lombok.Getter;

@Getter
public class ReviewRequest {
    private ReviewRate rate;
    private String content;
}
