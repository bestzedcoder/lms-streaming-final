package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.question.OptionResponse;
import com.hust.lms.streaming.dto.response.question.QuestionCategoryResponse;
import com.hust.lms.streaming.dto.response.question.QuestionResponse;
import com.hust.lms.streaming.model.Option;
import com.hust.lms.streaming.model.Question;
import com.hust.lms.streaming.model.QuestionCategory;

public class QuestionMapper {
  private QuestionMapper() {
    throw new AssertionError("Utility class");
  }

  public static QuestionCategoryResponse mapQuestionCategoryToQuestionCategoryResponse(
      QuestionCategory questionCategory) {
    if (questionCategory == null) return null;

    QuestionCategoryResponse response = new QuestionCategoryResponse();
    response.setId(questionCategory.getId());
    response.setName(questionCategory.getName());
    response.setTotalQuestions(questionCategory.getQuestions().size());
    return response;
  }

  public static QuestionResponse mapQuestionToQuestionResponse(Question question) {
    if (question == null) return null;
    QuestionResponse response = new QuestionResponse();
    response.setId(question.getId());
    response.setContent(question.getContent());
    response.setType(question.getType());
    response.setOptions(question.getOptions().stream().map(QuestionMapper::mapOptionToOptionResponse).toList());
    return response;
  }

  public static OptionResponse mapOptionToOptionResponse(Option option) {
    if (option == null) return null;

    OptionResponse response = new OptionResponse();
    response.setId(option.getId());
    response.setAnswer(option.getAnswer());
    response.setCorrect(option.getCorrect());
    return response;
  }

}
