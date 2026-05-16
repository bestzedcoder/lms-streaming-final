package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.quiz.*;
import com.hust.lms.streaming.model.*;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class QuizMapper {
    private QuizMapper() {throw new AssertionError("Utility class");}

    public static QuizResponse mapQuizToQuizResponse(Quiz quiz) {
        if (quiz == null) return null;

        QuizResponse response = new QuizResponse();
        response.setId(quiz.getId());
        response.setTitle(quiz.getTitle());
        response.setTotalQuestions(quiz.getQuestions().size());
        response.setStatus(quiz.getStatus());
        response.setType(quiz.getType());
        response.setQuestions(quiz.getQuestions().stream().map(QuizMapper::mapQuizQuestionToQuizQuestionResponse).toList());
        return response;
    }

    public static QuizQuestionResponse mapQuizQuestionToQuizQuestionResponse(QuizQuestion quizQuestion) {
        if (quizQuestion == null) return null;

        QuizQuestionResponse response = new QuizQuestionResponse();
        response.setId(quizQuestion.getId());
        response.setContent(quizQuestion.getQuestion().getContent());
        response.setType(quizQuestion.getQuestion().getType());
        response.setAnswers(quizQuestion.getQuestion().getOptions().stream().map(QuizMapper::mapAnswerToQuestionAnswerResponse).toList());
        return response;
    }

    public static QuestionAnswerResponse mapAnswerToQuestionAnswerResponse(Option option) {
        if (option == null) return null;

        QuestionAnswerResponse response = new QuestionAnswerResponse();
        response.setAnswer(option.getAnswer());
        response.setCorrect(option.getCorrect());
        return response;
    }

    public static SelectQuizResponse mapQuizToSelectQuizResponse(Quiz quiz) {
        if (quiz == null) return null;

        SelectQuizResponse response = new SelectQuizResponse();
        response.setQuizId(quiz.getId());
        response.setTitle(quiz.getTitle());
        response.setType(quiz.getType());
        return response;
    }

    public static QuizLearningResponse mapQuizToQuizLearningResponse(Quiz quiz) {
        if (quiz == null) return null;

        QuizLearningResponse response = new QuizLearningResponse();
        response.setQuizId(quiz.getId());
        response.setTitle(quiz.getTitle());
        response.setVersion(quiz.getVersions().size());
        response.setQuestions(quiz.getQuestions().stream().map(q -> QuizMapper.mapQuestionToQuestionLearningResponse(q.getQuestion())).toList());
        return response;
    }

    public static QuestionLearningResponse mapQuestionToQuestionLearningResponse(Question question) {
        if (question == null) return null;

        QuestionLearningResponse response = new QuestionLearningResponse();
        response.setQuestionId(question.getId());
        response.setType(question.getType());
        response.setContent(question.getContent());
        response.setAnswers(question.getOptions().stream().map(QuizMapper::mapAnswerToAnswerLearningResponse).toList());
        return response;
    }

    public static AnswerLearningResponse mapAnswerToAnswerLearningResponse(Option option) {
        if (option == null) return null;

        AnswerLearningResponse response = new AnswerLearningResponse();
        response.setAnswerId(option.getId());
        response.setAnswer(option.getAnswer());
        return response;
    }

    public static QuizResultResponse mapQuizSubmissionToQuizResultResponse(QuizSubmission quizSubmission) {
        if (quizSubmission == null) return null;

        QuizResultResponse response = new QuizResultResponse();
        response.setTitle(quizSubmission.getTitle());
        response.setTotalQuestions(quizSubmission.getTotalQuestions());
        response.setCorrectAnswers(quizSubmission.getCorrectAnswers());
        response.setType(quizSubmission.getType());
        response.setScore(quizSubmission.getScore());
        response.setTime(quizSubmission.getCreatedAt());
        return response;
    }

    public static QuizCacheResponse mapQuizToQuizCacheResponse(Quiz quiz) {

        if (quiz == null) {
            return null;
        }

        Map<String, Set<String>> questions = quiz.getQuestions()
                .stream()
                .map(QuizQuestion::getQuestion)
                .collect(Collectors.toMap(
                        question -> question.getId().toString(),

                        question -> question.getOptions()
                                .stream()
                                .filter(option ->
                                        Boolean.TRUE.equals(option.getCorrect()))
                                .map(option ->
                                        option.getId().toString())
                                .collect(Collectors.toSet())
                ));

        return QuizCacheResponse.builder()
                .questions(questions)
                .build();
    }
}
