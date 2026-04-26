package com.hust.lms.streaming.model;

import com.hust.lms.streaming.enums.ResourceStatus;
import com.hust.lms.streaming.model.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "resources")
public class Resource extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id")
  private UUID id;

  @Column(name = "title", nullable = false)
  private String title;

  @Column(name = "url", nullable = false)
  private String url;

  @Column(name = "size")
  private Long size;

  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  @Builder.Default
  private ResourceStatus status = ResourceStatus.VALIDATING;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "owner_id", nullable = false, updatable = false)
  private Instructor owner;

  @OneToMany(mappedBy = "resource", fetch = FetchType.LAZY)
  @Builder.Default
  private List<Lesson> lessons = new ArrayList<>();
}