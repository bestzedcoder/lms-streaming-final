package com.hust.lms.streaming.dto.response.review;

import com.hust.lms.streaming.enums.ReviewRate;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewCourseResponse {
  private UUID id;
  private ReviewRate rate;
  private String content;
  private ReviewUserResponse user;
}
