package com.hust.lms.streaming.model;

import com.hust.lms.streaming.model.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
@Entity
@Table(name = "lesson_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"_user_id", "_lesson_id"})
})
public class LessonProgress extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "_id")
  private UUID id;

  @Column(name = "_is_completed", nullable = false)
  @Builder.Default
  private boolean isCompleted = false;

  @Column(name = "_last_watched_second")
  @Builder.Default
  private Integer lastWatchedSecond = 0;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "_user_id", nullable = false, updatable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "_lesson_id", nullable = false, updatable = false)
  private Lesson lesson;
}