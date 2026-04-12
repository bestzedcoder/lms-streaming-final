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


@Setter
@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "videos")
public class Video extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id")
  private UUID id;

  @Column(name = "title", nullable = false)
  private String title;

  @Column(name = "size", nullable = false)
  private Long size;

  @Column(name = "duration", nullable = false)
  private Integer duration;

  // Các đường dẫn Stream
  @Column(name = "hls_url")
  private String hlsUrl;

  @Column(name = "original_url", nullable = false)
  private String originalUrl;

  @Column(name = "thumbnail")
  private String thumbnail;

  @Column(name = "public_id")
  private String publicId;

  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  @Builder.Default
  private VideoStatus status = VideoStatus.PENDING_REVIEW;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "owner_id", nullable = false, updatable = false)
  private Instructor owner;

}
