package com.hust.lms.streaming.dto.response.review;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewUserResponse {
  private String email;
  private String avatarUrl;
}
