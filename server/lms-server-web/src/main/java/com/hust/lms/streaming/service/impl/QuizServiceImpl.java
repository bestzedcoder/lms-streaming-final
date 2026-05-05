package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.dto.request.instructor.AddQuizQuestionRequest;
import com.hust.lms.streaming.dto.request.instructor.QuizCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.QuizUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.RemoveQuizQuestionRequest;
import com.hust.lms.streaming.dto.request.quiz.QuestionSubmissionRequest;
import com.hust.lms.streaming.dto.request.quiz.QuizSubmissionRequest;
import com.hust.lms.streaming.dto.response.quiz.QuizResponse;
import com.hust.lms.streaming.dto.response.quiz.QuizResultResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.enums.QuizStatus;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.QuizMapper;
import com.hust.lms.streaming.model.*;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.*;
import com.hust.lms.streaming.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {
    private final QuizRepository quizRepository;
    private final InstructorRepository instructorRepository;
    private final QuestionRepository questionRepository;
    private final QuizSubmissionRepository quizSubmissionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final RedisService redisService;

    @Override
    public List<QuizResponse> getQuizzes() {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        String keyCache = "lms:quizzes:instructor:" + authId;

        List<QuizResponse> dataCache = this.redisService.getValue(keyCache, new TypeReference<List<QuizResponse>>() {});
        if (dataCache != null) {
            return dataCache;
        }

        List<Quiz> data = this.quizRepository.findAllByOwner(UUID.fromString(authId));
        List<QuizResponse> res = data.stream().map(QuizMapper::mapQuizToQuizResponse).toList();

        this.redisService.saveKeyAndValue(keyCache, res, 1, TimeUnit.MINUTES);
        return res;
    }

    @Override
    public void createQuiz(QuizCreatingRequest request) {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Instructor instructor = this.instructorRepository.getReferenceById(UUID.fromString(authId));

        Quiz quiz = Quiz.builder()
                .status(QuizStatus.DRAFT)
                .owner(instructor)
                .title(request.getTitle())
                .build();
        this.quizRepository.save(quiz);
    }

    @Override
    public void updateQuiz(QuizUpdatingRequest request) {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Quiz quiz = this.quizRepository.findByOwner(UUID.fromString(authId), UUID.fromString(request.getId())).orElse(null);
        if (quiz == null) return;
        quiz.setTitle(request.getTitle());
        quiz.setStatus(request.getStatus());
        this.quizRepository.save(quiz);
    }

    @Override
    public void addQuizQuestion(AddQuizQuestionRequest request) {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Quiz quiz = this.quizRepository.findByOwner(UUID.fromString(authId), UUID.fromString(request.getQuizId())).orElse(null);
        Question question = this.questionRepository.findByOwner(UUID.fromString(request.getQuestionId()), UUID.fromString(authId)).orElse(null);
        if (quiz == null || question == null) return;

        quiz.getQuestions().add(QuizQuestion.builder()
                        .question(question)
                        .quiz(quiz)
                .build());
        this.quizRepository.save(quiz);
    }

    @Override
    public void removeQuizQuestion(RemoveQuizQuestionRequest request) {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Quiz quiz = this.quizRepository.findByOwner(UUID.fromString(authId), UUID.fromString(request.getQuizId())).orElse(null);

        if (quiz == null) return;

        UUID quizQuestionId = UUID.fromString(request.getQuizQuestionId());

        quiz.getQuestions().removeIf(q ->
                q.getId().equals(quizQuestionId)
        );

        quizRepository.save(quiz);
    }

    @Override
    public void deleteQuiz(UUID quizId) {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Quiz quiz = this.quizRepository.findByOwner(UUID.fromString(authId), quizId).orElse(null);

        if (quiz == null) return;

        this.quizRepository.delete(quiz);
    }

    @Override
    public Integer submitQuiz(QuizSubmissionRequest request, String slug) {
        String authId = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal()
                .toString();

        User student = userRepository.getReferenceById(UUID.fromString(authId));
        Course course = this.courseRepository.findBySlugAndStatus(slug, CourseStatus.PUBLISHED).orElseThrow(() -> new BadRequestException("Khóa học không tồn tại"));

        Quiz quiz = quizRepository.findById(UUID.fromString(request.getQuizId()))
                .orElseThrow(() -> new BadRequestException("Quiz không tồn tại"));

        int countQuestionCorrect = 0;
        int countQuestion = quiz.getQuestions().size();

        List<Question> questions = quiz.getQuestions()
                .stream()
                .map(QuizQuestion::getQuestion)
                .toList();

        for (QuestionSubmissionRequest submittedQuestion : request.getQuestions()) {

            if (submittedQuestion.getAnswers() == null
                    || submittedQuestion.getAnswers().isEmpty()) {
                continue;
            }

            Question question = questions.stream()
                    .filter(q -> q.getId().toString().equals(submittedQuestion.getQuestionId()))
                    .findFirst()
                    .orElse(null);

            if (question == null) {
                continue;
            }

            List<String> correctAnswerIds = question.getOptions()
                    .stream()
                    .filter(option -> Boolean.TRUE.equals(option.getCorrect()))
                    .map(option -> option.getId().toString())
                    .sorted()
                    .toList();

            List<String> submittedAnswerIds = submittedQuestion.getAnswers()
                    .stream()
                    .sorted()
                    .toList();

            if (correctAnswerIds.equals(submittedAnswerIds)) {
                countQuestionCorrect++;
            }
        }

        QuizSubmission quizSubmission = QuizSubmission.builder()
                .title(quiz.getTitle())
                .correctAnswers(countQuestionCorrect)
                .course(course)
                .user(student)
                .totalQuestions(countQuestion)
                .build();
        this.quizSubmissionRepository.save(quizSubmission);

        return countQuestionCorrect;
    }

    @Override
    public List<QuizResultResponse> getQuizSubmission(String slug) {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        if (!this.enrollmentRepository.existsByUserIdAndCourseSlug(UUID.fromString(authId), slug)) {
            throw new BadRequestException("Truy câp không hợp lệ");
        }

        String keyCache = "lms:quiz-submission:student:" + authId;
        List<QuizResultResponse> dataCache = this.redisService.getValue(keyCache, new TypeReference<List<QuizResultResponse>>() {});

        if (dataCache != null) return dataCache;

        List<QuizSubmission> data = this.quizSubmissionRepository.findByStudent(slug, UUID.fromString(authId));
        List<QuizResultResponse> res = data.stream().map(QuizMapper::mapQuizSubmissionToQuizResultResponse).toList();

        this.redisService.saveKeyAndValue(keyCache, res, 1, TimeUnit.MINUTES);
        return List.of();
    }
}
