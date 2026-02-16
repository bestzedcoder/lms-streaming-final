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
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "courses")
public class Course extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "_id")
  private UUID id;

  @Column(name = "_title", nullable = false)
  private String title;

  @Column(name = "_slug" , nullable = false , unique = true)
  private String slug;

  @Column(name = "_description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "_price" , nullable = false)
  @Builder.Default
  private BigDecimal price = BigDecimal.ZERO;

  @Column(name = "_salePrice")
  @Builder.Default
  private BigDecimal salePrice = BigDecimal.ZERO;

  @Column(name = "_thumbnail")
  private String thumbnail;

  @Column(name = "_public_id")
  private String publicId;

  @Column(name = "_level", nullable = false)
  @Enumerated(EnumType.STRING)
  @Builder.Default
  private LevelCourse level = LevelCourse.BEGINNER;

  @Column(name = "_status", nullable = false)
  @Enumerated(EnumType.STRING)
  @Builder.Default
  private CourseStatus status = CourseStatus.PENDING;

  @Column(name = "_average_rating")
  @Builder.Default
  private Double averageRating = 0.0;

  @Column(name = "_count_rating")
  @Builder.Default
  private Integer countRating = 0;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "_category_id" , nullable = false , updatable = false)
  @JsonIgnore
  private Category category;

  @ManyToOne
  @JoinColumn(name = "_instructor_id" , nullable = false , updatable = false)
  @JsonIgnore
  private Instructor instructor;

  @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
  @OrderBy("orderIndex ASC")
  @Builder.Default
  private List<Section> sections = new ArrayList<>();

  @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
  @Builder.Default
  private List<Enrollment> enrollments = new ArrayList<>();

  @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
  @Builder.Default
  private List<Review> reviews = new ArrayList<>();
}
