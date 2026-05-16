package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.instructor.AddQuizQuestionRequest;
import com.hust.lms.streaming.dto.request.instructor.QuizCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.QuizUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.RemoveQuizQuestionRequest;
import com.hust.lms.streaming.dto.request.quiz.QuizSubmissionRequest;
import com.hust.lms.streaming.dto.response.quiz.QuizResponse;
import com.hust.lms.streaming.dto.response.quiz.QuizResultResponse;

import java.util.List;
import java.util.UUID;

public interface QuizService {
    List<QuizResponse> getQuizzes();
    void createQuiz(QuizCreatingRequest request);
    void updateQuiz(QuizUpdatingRequest request);
    void addQuizQuestion(AddQuizQuestionRequest request);
    void removeQuizQuestion(RemoveQuizQuestionRequest request);
    void deleteQuiz(UUID quizId);
    void publishQuiz(UUID quizId);
    void draftQuiz(UUID quizId);

    Integer submitQuiz(QuizSubmissionRequest request, String slug);
    List<QuizResultResponse> getQuizSubmission(String slug);
}



