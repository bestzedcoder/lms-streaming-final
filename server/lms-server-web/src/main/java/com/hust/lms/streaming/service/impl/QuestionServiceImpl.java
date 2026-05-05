package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.dto.request.instructor.OptionCreatingRequest;
import com.hust.lms.streaming.dto.response.question.QuestionCategoryResponse;
import com.hust.lms.streaming.dto.response.question.QuestionResponse;
import com.hust.lms.streaming.enums.QuestionType;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.QuestionMapper;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.Option;
import com.hust.lms.streaming.model.Question;
import com.hust.lms.streaming.model.QuestionCategory;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.InstructorRepository;
import com.hust.lms.streaming.repository.jpa.QuestionCategoryRepository;
import com.hust.lms.streaming.repository.jpa.QuestionRepository;
import com.hust.lms.streaming.service.QuestionService;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
  private final QuestionRepository questionRepository;
  private final InstructorRepository instructorRepository;
  private final QuestionCategoryRepository questionCategoryRepository;
  private final RedisService redisService;

  @Override
  public List<QuestionResponse> getQuestions(UUID categoryId) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    if (!this.questionCategoryRepository.existsById(categoryId)) throw new BadRequestException("Danh mục không tồn tại");

    String keyCache = String.format("lms:question:category:%s:instructor:%s", categoryId, authId);
    List<QuestionResponse> dataCache = this.redisService.getValue(keyCache, new TypeReference<List<QuestionResponse>>() {});

    if (dataCache != null) {
      return dataCache;
    }

    List<Question> data = this.questionRepository.getQuestionsByOwner(UUID.fromString(authId), categoryId);
    List<QuestionResponse> res = data.stream().map(QuestionMapper::mapQuestionToQuestionResponse).toList();

    this.redisService.saveKeyAndValue(keyCache, res, 1, TimeUnit.MINUTES);

    return res;
  }

  @Override
  public void createQuestion(UUID categoryId, QuestionType type, String content,
      List<OptionCreatingRequest> options) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Instructor instructor = this.instructorRepository.getReferenceById(UUID.fromString(authId));
    QuestionCategory category = this.questionCategoryRepository.getReferenceById(categoryId);
    Question question = Question.builder()
        .type(type)
        .content(content)
        .owner(instructor)
        .category(category)
        .build();

    if (options != null && !options.isEmpty()) {
      List<Option> opts = options.stream().map(
          opt -> {
            return (Option) Option.builder()
                .answer(opt.getAnswer())
                .question(question)
                .correct(opt.getCorrect())
                .build();
          }
      ).toList();
      question.getOptions().addAll(opts);
    }

    questionRepository.save(question);
  }

  @Override
  public void updateQuestion(UUID questionId, QuestionType type, String content,
      List<OptionCreatingRequest> options) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Question question = this.questionRepository.findByOwner(questionId, UUID.fromString(authId)).orElseThrow(() -> new BadRequestException("Câu hỏi này không tồn tại"));
    question.setType(type);
    question.setContent(content);
    if (!question.getOptions().isEmpty()) {
      question.getOptions().clear();
    }

    if (options != null && !options.isEmpty()) {
      List<Option> opts = options.stream().map(
          opt -> {
            return (Option) Option.builder()
                .answer(opt.getAnswer())
                .question(question)
                .correct(opt.getCorrect())
                .build();
          }
      ).toList();
      question.getOptions().addAll(opts);
    }
    questionRepository.save(question);
  }

  @Override
  public void deleteQuestion(UUID questionId) {

  }

  @Override
  public List<QuestionCategoryResponse> getQuestionCategories() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    String keyCache = "lms:question-categories:instructor:" + authId;

    List<QuestionCategoryResponse> dataCache = this.redisService.getValue(keyCache, new TypeReference<List<QuestionCategoryResponse>>() {});

    if (dataCache != null) {
      return dataCache;
    }

    List<QuestionCategory> data = this.questionCategoryRepository.findByOwnerId(UUID.fromString(authId));
    List<QuestionCategoryResponse> res = data.stream().map(QuestionMapper::mapQuestionCategoryToQuestionCategoryResponse).toList();

    this.redisService.saveKeyAndValue(keyCache, res, 2, TimeUnit.MINUTES);
    return res;
  }

  @Override
  public void createCategory(String name) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Instructor instructor = this.instructorRepository.getReferenceById(UUID.fromString(authId));
    QuestionCategory questionCategory = QuestionCategory.builder()
        .name(name)
        .owner(instructor)
        .build();
    this.questionCategoryRepository.save(questionCategory);
  }

  @Override
  public void updateCategory(UUID categoryId, String name) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    QuestionCategory qc = this.questionCategoryRepository.findByIdAndOwnerId(categoryId, UUID.fromString(authId)).orElseThrow(() -> new BadRequestException("Không tồn tại danh mục này"));
    qc.setName(name);
    this.questionCategoryRepository.save(qc);
  }

  @Override
  public void deleteCategory(UUID categoryId) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    QuestionCategory qc = this.questionCategoryRepository.findByIdAndOwnerId(categoryId, UUID.fromString(authId)).orElseThrow(() -> new BadRequestException("Không tồn tại danh mục này"));
    if (!qc.getQuestions().isEmpty()) {
      throw new BadRequestException("Không thể xóa danh mục khi chưa xóa hết câu hỏi");
    }

    this.questionCategoryRepository.delete(qc);
  }
}
