package com.hust.lms.streaming.dto.response.review;

import com.hust.lms.streaming.enums.ReviewRate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewPublicResponse {
  private String content;
  private ReviewRate rating;
  private String user;
}
