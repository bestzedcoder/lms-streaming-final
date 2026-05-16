package com.hust.lms.streaming.model.Dto;

import java.time.LocalDateTime;

public interface QuizSubmissionExportProjection {
    String getFirstName();

    String getLastName();

    String getEmail();

    String getPhoneNumber();

    String getQuizTitle();

    Integer getVersionNumber();

    Integer getTotalQuestions();

    Integer getCorrectAnswers();

    Double getScore();

    LocalDateTime getSubmittedAt();
}
