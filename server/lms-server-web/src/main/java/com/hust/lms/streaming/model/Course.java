package com.hust.lms.streaming.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.enums.LevelCourse;
import com.hust.lms.streaming.model.common.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "courses")
public class Course extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id")
  private UUID id;

  @Column(name = "title", nullable = false, updatable = false)
  private String title;

  @Column(name = "slug", nullable = false, updatable = false, unique = true)
  private String slug;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "description_short", columnDefinition = "TEXT")
  private String descriptionShort;

  @Column(name = "course_requirements", columnDefinition = "TEXT")
  private String requirements;

  @Column(name = "thumbnail")
  private String thumbnail;

  @Column(name = "public_id")
  private String publicId;

  @Column(name = "level", nullable = false)
  @Enumerated(EnumType.STRING)
  @Builder.Default
  private LevelCourse level = LevelCourse.BEGINNER;

  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  @Builder.Default
  private CourseStatus status = CourseStatus.PENDING;

  @Column(name = "average_rating")
  @Builder.Default
  private Double averageRating = 0.0;

  @Column(name = "count_rating")
  @Builder.Default
  private Integer countRating = 0;

  @ManyToOne
  @JoinColumn(name = "category_id" , nullable = false , updatable = false)
  private Category category;

  @ManyToOne
  @JoinColumn(name = "instructor_id" , nullable = false , updatable = false)
  private Instructor instructor;

  @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @OrderBy("orderIndex ASC")
  @Builder.Default
  private List<Section> sections = new ArrayList<>();

  @OneToMany(mappedBy = "course", fetch = FetchType.EAGER)
  @Builder.Default
  private List<Enrollment> enrollments = new ArrayList<>();

  @OneToMany(mappedBy = "course", fetch = FetchType.EAGER)
  @Builder.Default
  private List<Review> reviews = new ArrayList<>();
}
