package com.hust.lms.streaming.dto.response.category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryPublicResponse {
  private String id;
  private String name;
  private String slug;
}
