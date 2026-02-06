package com.hust.lms.streaming.model;

import com.hust.lms.streaming.model.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
@Entity
@Table(name = "enrollments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"_user_id", "_course_id"})
})
public class Enrollment extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "_id")
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "_user_id", nullable = false, updatable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "_course_id", nullable = false, updatable = false)
  private Course course;

  @Column(name = "_price_paid", nullable = false)
  private BigDecimal pricePaid;

  @Column(name = "_progress")
  @Builder.Default
  private Double progress = 0.0; // 0.0 -> 100.0

  @Column(name = "_completed_at")
  private LocalDateTime completedAt; // Ngày hoàn thành

  @Column(name = "_last_accessed_at")
  private LocalDateTime lastAccessedAt; // Để sort danh sách "Học gần đây"

}