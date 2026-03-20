package com.hust.lms.streaming.model.elasticsearch;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDocumentDto {
  private String id;
  private String title;
  private String slug;
  private String descriptionShort;
  private String thumbnail;
  private String nickname;
  private String categorySlug;
  private Double averageRating;
  private Integer totalLessons;
}
