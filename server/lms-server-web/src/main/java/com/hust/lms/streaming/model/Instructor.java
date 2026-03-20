package com.hust.lms.streaming.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hust.lms.streaming.model.common.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
@Table(name = "instructors")
public class Instructor extends BaseEntity {

  @Id
  @Column(name = "user_id")
  private UUID id;

  @OneToOne(fetch = FetchType.EAGER)
  @MapsId
  @JoinColumn(name = "user_id")
  private User user;

  @Column(name = "nickname", nullable = false)
  private String nickname;

  @Column(name = "job_title", nullable = false)
  private String jobTitle;

  @Column(name = "bio",columnDefinition = "TEXT")
  private String bio;

  @Column(name = "total_student")
  @Builder.Default
  private Integer totalStudent = 0;

  @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @Builder.Default
  private List<Course> courses = new ArrayList<>();
}
