package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.response.quiz.QuizLearningResponse;

import java.util.UUID;

public interface LearningService {
    String learnVideo(String Slug, UUID lessonId);
    String learnLecture(String slug, UUID lessonId);
    QuizLearningResponse learnQuiz(String slug, UUID lessonId);
}
