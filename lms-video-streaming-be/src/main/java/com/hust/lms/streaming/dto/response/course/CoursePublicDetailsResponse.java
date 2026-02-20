package com.hust.lms.streaming.dto.response.course;

import com.hust.lms.streaming.dto.response.review.ReviewPublicResponse;
import com.hust.lms.streaming.enums.LevelCourse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CoursePublicDetailsResponse {
  private String title;
  private String slug;
  private String descriptionShort;
  private String description;
  private String requirements;
  private String thumbnail;
  private BigDecimal price;
  private BigDecimal salePrice;
  private LevelCourse level;
  private Double averageRating;
  private int countRating;
  private int countStudents;
  private int totalSections;
  private int totalLessons;
  @Builder.Default
  private List<ReviewPublicResponse> reviews = new ArrayList<>();
  @Builder.Default
  private List<SectionPublicResponse> sections = new ArrayList<>();
  private InstructorPublicResponse instructor;
  private LocalDateTime updatedAt;
}
