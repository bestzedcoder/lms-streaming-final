package com.hust.lms.streaming.dto.response.review;

import com.hust.lms.streaming.enums.ReviewRate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private String fullName;
    private ReviewRate rate;
    private String content;
    private LocalDateTime time;
}
