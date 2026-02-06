package com.hust.lms.streaming.model;

import com.hust.lms.streaming.enums.VideoStatus;
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
@SuperBuilder
@Setter
@Getter
@Entity
@Table(name = "videos")
public class Video extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "_id")
  private UUID id;

  @Column(name = "_title", nullable = false)
  private String title;

  @Column(name = "_file_name", nullable = false)
  private String fileName;

  @Column(name = "_size", nullable = false)
  private Long size;
  @Column(name = "_duration", nullable = false)
  private Integer duration;

  // Các đường dẫn Stream
  @Column(name = "_hls_url")
  private String hlsUrl;

  @Column(name = "_thumbnail")
  private String thumbnail;

  @Column(name = "_public_id")
  private String publicId;

  @Column(name = "_status", nullable = false)
  @Enumerated(EnumType.STRING)
  @Builder.Default
  private VideoStatus status = VideoStatus.PENDING;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "_owner_id", nullable = false)
  private User owner;
}
