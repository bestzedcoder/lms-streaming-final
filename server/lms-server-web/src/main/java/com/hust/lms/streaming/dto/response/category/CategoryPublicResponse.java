package com.hust.lms.streaming.dto.response.category;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryPublicResponse {
  private UUID id;
  private String name;
  private String slug;
}
