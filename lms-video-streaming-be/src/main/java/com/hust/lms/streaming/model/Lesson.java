package com.hust.lms.streaming.model;

import com.hust.lms.streaming.enums.LessonType;
import com.hust.lms.streaming.model.common.BaseEntity;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@Entity
@Table(name = "lessons")
public class Lesson extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "_id")
  private UUID id;

  @Column(name = "_title", nullable = false)
  private String title;

  @Enumerated(EnumType.STRING)
  @Column(name = "_lesson_type", nullable = false)
  @Builder.Default
  private LessonType lessonType = LessonType.VIDEO;

  @Column(name = "_order_index", nullable = false)
  private Integer orderIndex;

  @Column(name = "_is_preview", nullable = false)
  @Builder.Default
  private Boolean isPreview = false;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "_video_id")
  private Video video;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "_section_id" ,nullable = false, updatable = false)
  private Section section;
}
