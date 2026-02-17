package com.hust.lms.streaming.dto.response.instructor;

import com.hust.lms.streaming.dto.response.category.CategoryPublicResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.enums.LevelCourse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorCourseResponse {
  private UUID id;
  private String title;
  private String slug;
  private String description;
  private String descriptionShort;
  private String requirements;
  private BigDecimal price;
  private BigDecimal salePrice;
  private String thumbnail;
  private LevelCourse level;
  private CourseStatus status;
  private Double averageRating;
  private int countRating;
  private CategoryPublicResponse category;
  private int totalSections;
  private int totalLessons;
  private int totalStudents;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private String createdBy;
  private String updatedBy;
}
