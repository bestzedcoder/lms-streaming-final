package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.instructor.OptionCreatingRequest;
import com.hust.lms.streaming.dto.response.question.QuestionCategoryResponse;
import com.hust.lms.streaming.dto.response.question.QuestionResponse;
import com.hust.lms.streaming.enums.QuestionType;
import java.util.List;
import java.util.UUID;

public interface QuestionService {
  // question
  List<QuestionResponse> getQuestions(UUID categoryId);
  void createQuestion(UUID categoryId ,QuestionType type, String content, List<OptionCreatingRequest> options);
  void updateQuestion(UUID questionId, QuestionType type, String content, List<OptionCreatingRequest> options);
  void deleteQuestion(UUID questionId);

  // category
  List<QuestionCategoryResponse> getQuestionCategories();
  void createCategory(String name);
  void updateCategory(UUID categoryId, String name);
  void deleteCategory(UUID categoryId);
}
