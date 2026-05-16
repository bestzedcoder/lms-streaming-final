package com.hust.lms.streaming.model;

import com.hust.lms.streaming.enums.QuizType;
import com.hust.lms.streaming.model.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "quiz_submission")
public class QuizSubmission extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private User user;

    @Column(name = "title", nullable = false, updatable = false)
    private String title;

    @Column(name = "total_questions", nullable = false, updatable = false)
    private Integer totalQuestions;

    @Column(name = "correct_answers", nullable = false, updatable = false)
    private Integer correctAnswers;

    @Column(name = "type", nullable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private QuizType type = QuizType.TEST;

    @Column(name = "score", nullable = false, updatable = false)
    @Builder.Default
    private Double score = 0.0;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false, updatable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_version_id", nullable = false, updatable = false)
    private QuizVersion quizVersion;

}
