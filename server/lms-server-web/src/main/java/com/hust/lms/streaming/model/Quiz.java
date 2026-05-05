package com.hust.lms.streaming.model;


import com.hust.lms.streaming.enums.QuizStatus;
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
@Table(name = "quizzes")
public class Quiz extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private QuizStatus status = QuizStatus.DRAFT;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", unique = true)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false, updatable = false)
    private Instructor owner;

    @OneToMany(mappedBy = "quiz", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<QuizQuestion> questions = new ArrayList<>();
}
