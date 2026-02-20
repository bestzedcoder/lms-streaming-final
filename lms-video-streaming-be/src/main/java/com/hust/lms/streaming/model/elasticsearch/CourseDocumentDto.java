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
  private Double price;
  private Double salePrice;
  private String descriptionShort;
  private String thumbnail;
  private String instructorName;
  private String categorySlug;
  private Double averageRating;
  private Integer countLesson;
}
