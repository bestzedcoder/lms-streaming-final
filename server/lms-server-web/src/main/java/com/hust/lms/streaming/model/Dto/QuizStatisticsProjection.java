package com.hust.lms.streaming.model.Dto;

import com.hust.lms.streaming.enums.QuizType;

import java.util.UUID;

public interface QuizStatisticsProjection {

    UUID getId();

    String getTitle();

    int getTotalSubmissions();

    QuizType getType();

    double getAverageScore();
}