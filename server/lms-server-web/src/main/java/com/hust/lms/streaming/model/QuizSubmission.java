package com.hust.lms.streaming.model;

import com.hust.lms.streaming.model.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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

    @Column(name = "correct_answerss", nullable = false, updatable = false)
    private Integer correctAnswers;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

}
