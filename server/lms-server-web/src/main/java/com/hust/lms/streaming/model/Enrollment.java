package com.hust.lms.streaming.model;

import com.hust.lms.streaming.enums.EnrollmentStatus;
import com.hust.lms.streaming.model.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "enrollments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "course_id"})
})
public class Enrollment extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id")
  private UUID id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id", nullable = false, updatable = false)
  private User user;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "course_id", nullable = false, updatable = false)
  private Course course;

  @Column(name = "progress")
  @Builder.Default
  private Double progress = 0.0;

  @Column(name = "completed_at")
  private LocalDateTime completedAt;

  @Column(name = "last_accessed_at")
  private LocalDateTime lastAccessedAt;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  @Builder.Default
  private EnrollmentStatus status = EnrollmentStatus.ACTIVE;

  @Column(name = "reason", columnDefinition = "TEXT")
  private String reason;
}