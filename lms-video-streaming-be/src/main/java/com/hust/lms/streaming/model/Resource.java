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
@Table(name = "resources")
public class Resource extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "_id")
  private UUID id;

  @Column(name = "_name", nullable = false)
  private String title;

  @Column(name = "_url", nullable = false)
  private String url;

  @Column(name = "_size")
  private Long size;

  @Column(name = "_file_extension")
  private String fileExtension;

  @Column(name = "_mime_type")
  private String mimeType;


}