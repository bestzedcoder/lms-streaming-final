package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.request.instructor.InstructorUpdatingRequest;
import com.hust.lms.streaming.dto.request.upload.ResourceCreatingRequest;
import com.hust.lms.streaming.dto.request.upload.ResourceUpdatingRequest;
import com.hust.lms.streaming.dto.request.upload.VideoCreatingRequest;
import com.hust.lms.streaming.dto.request.upload.VideoUpdatingRequest;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseStatisticsOverviewResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorQuizResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorQuizStatisticsResponse;
import com.hust.lms.streaming.enums.LessonType;
import com.hust.lms.streaming.enums.QuizType;
import com.hust.lms.streaming.enums.ResourceStatus;
import com.hust.lms.streaming.enums.VideoStatus;
import com.hust.lms.streaming.event.custom.ResourceValidationEvent;
import com.hust.lms.streaming.event.enums.ResourceType;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.InstructorMapper;
import com.hust.lms.streaming.model.*;
import com.hust.lms.streaming.model.Dto.QuizStatisticsProjection;
import com.hust.lms.streaming.model.Dto.QuizSubmissionExportProjection;
import com.hust.lms.streaming.model.Dto.ScoreDistributionProjection;
import com.hust.lms.streaming.repository.jpa.*;
import com.hust.lms.streaming.service.InstructorService;

import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.stream.Collectors;

import com.hust.lms.streaming.upload.CloudinaryService;
import com.hust.lms.streaming.upload.CloudinaryUploadResult;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {
  private final InstructorRepository instructorRepository;
  private final UserRepository userRepository;
  private final CourseRepository courseRepository;
  private final QuizRepository quizRepository;
  private final QuizSubmissionRepository quizSubmissionRepository;
  private final CloudinaryService cloudinaryService;
  private final ResourceRepository resourceRepository;
  private final VideoRepository videoRepository;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  public void update(InstructorUpdatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));
    Instructor instructor = this.instructorRepository.findById(UUID.fromString(authId)).orElse(
        Instructor.builder()
            .user(currentUser)
            .build()
    );

    instructor.setNickname(request.getNickname());
    instructor.setJobTitle(request.getJobTitle());
    instructor.setBio(request.getBio());
    this.instructorRepository.save(instructor);
  }

  @Override
  public InstructorInfoResponse getInfo() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

    Instructor instructor = this.instructorRepository.findById(UUID.fromString(authId)).orElse(null);

    return InstructorMapper.mapInstructorToInstructorInfoResponse(instructor);
  }

  @Override
  @Transactional
  public void createVideoRecord(VideoCreatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Instructor instructor = this.instructorRepository.getReferenceById(UUID.fromString(authId));

    Video video = this.videoRepository.save(Video.builder()
            .title(request.getTitle())
            .duration(request.getDuration())
            .originalUrl(request.getFileKey())
            .size(request.getSize())
            .status(VideoStatus.VALIDATING)
            .owner(instructor)
            .build());
    this.eventPublisher.publishEvent(new ResourceValidationEvent(ResourceType.VIDEO, video.getId(), video.getOriginalUrl()));
  }

  @Override
  @Transactional
  public void createResourceRecord(ResourceCreatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Instructor instructor = this.instructorRepository.getReferenceById(UUID.fromString(authId));

    Resource lecture = this.resourceRepository.save(Resource.builder()
            .url(request.getFileKey())
            .title(request.getTitle())
            .size(request.getSize())
            .status(ResourceStatus.VALIDATING)
            .owner(instructor)
            .build());
    this.eventPublisher.publishEvent(new ResourceValidationEvent(ResourceType.LECTURE, lecture.getId(), lecture.getUrl()));
  }

  @Override
  public void updateResourceRecord(ResourceUpdatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Resource resource = this.resourceRepository.findByOwner(UUID.fromString(authId), UUID.fromString(request.getResourceId())).orElseThrow(() -> new BadRequestException("Không tồn tại tài nguyên"));
    resource.setTitle(request.getTitle());
    this.resourceRepository.save(resource);
  }

  @Override
  public void updateVideoRecord(VideoUpdatingRequest request, MultipartFile image) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Video video = this.videoRepository.findByOwner(UUID.fromString(authId), UUID.fromString(request.getVideoId())).orElseThrow(() -> new BadRequestException("Không tồn tại tài nguyên"));
    if (image != null) {
      if (video.getThumbnail() != null) {
        this.cloudinaryService.deleteImage(video.getPublicId());
      }
      CloudinaryUploadResult res = this.cloudinaryService.uploadImage(image, "video");
      video.setThumbnail(res.getUrl());
      video.setPublicId(res.getPublicId());
    }
    video.setTitle(request.getTitle());
    this.videoRepository.save(video);
  }

  @Override
  public InstructorCourseStatisticsOverviewResponse courseOverview(UUID courseId) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

    Course course = this.courseRepository.findCourseByIdAndInstructorId(courseId, UUID.fromString(authId)).orElse(null);

    if (course == null) return null;

    int totalStudents = course.getEnrollments().size();
    int totalReviews = course.getReviews().size();
    double averageRating = course.getAverageRating();
    int totalVideos = 0;
    int totalLectures = 0;
    int totalTests = 0;
    int totalExams = 0;

    List<Lesson> lessons = this.courseRepository.findLessonsByCourseId(courseId);

    for (Lesson lesson : lessons) {
      if (LessonType.VIDEO.equals(lesson.getLessonType())) {
        totalVideos++;
      } else if (LessonType.TEXT.equals(lesson.getLessonType())) {
        totalLectures++;
      } else if (LessonType.QUIZ.equals(lesson.getLessonType())) {
        Quiz quiz = this.quizRepository.findByLesson(lesson.getId()).orElse(null);
        if (quiz == null) continue;

        if (QuizType.TEST.equals(quiz.getType())) {
          totalTests++;
        } else {
          totalExams++;
        }
      }
    }

    Map<Double, Integer> scoreTestDistribution = this.quizSubmissionRepository.getScoreDistributionLatestVersion(courseId, QuizType.TEST.toString()).stream()
            .collect(Collectors.toMap(
                    ScoreDistributionProjection::getScore,
                    ScoreDistributionProjection::getTotal,
                    (a, b) -> a,
                    LinkedHashMap::new
            ));

    Map<Double, Integer> scoreExamDistribution = this.quizSubmissionRepository.getScoreDistributionLatestVersion(courseId, QuizType.EXAM.toString()).stream()
            .collect(Collectors.toMap(
                    ScoreDistributionProjection::getScore,
                    ScoreDistributionProjection::getTotal,
                    (a, b) -> a,
                    LinkedHashMap::new
            ));

    return InstructorCourseStatisticsOverviewResponse.builder()
            .totalStudents(totalStudents)
            .totalVideos(totalVideos)
            .totalLectures(totalLectures)
            .totalTests(totalTests)
            .totalExams(totalExams)
            .totalReviews(totalReviews)
            .averageRating(averageRating)
            .scoreTestDistribution(scoreTestDistribution)
            .scoreExamDistribution(scoreExamDistribution)
            .build();
  }

  @Override
  public List<InstructorQuizStatisticsResponse> getQuizzesInCourse(UUID courseId) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

    Course course = this.courseRepository.findCourseByIdAndInstructorId(courseId, UUID.fromString(authId)).orElse(null);
    if (course == null) return null;

    List<Lesson> lessons = this.courseRepository.findLessonsByCourseId(courseId);
    List<Lesson> lessonQuizzes = lessons.stream().filter(l -> LessonType.QUIZ.equals(l.getLessonType())).toList();

    List<InstructorQuizStatisticsResponse> res = new ArrayList<>();

    for (Lesson lesson : lessonQuizzes) {
      QuizStatisticsProjection data = this.quizRepository.getQuizInLesson(lesson.getId()).orElse(null);
      if (data == null) continue;

      List<Integer> versions = this.quizRepository.findVersionsByQuiz(data.getId());

      InstructorQuizResponse quiz = InstructorQuizResponse.builder()
              .quizId(data.getId())
              .type(data.getType())
              .totalSubmissions(data.getTotalSubmissions())
              .averageScore(data.getAverageScore())
              .title(data.getTitle())
              .build();
      InstructorQuizStatisticsResponse ele = InstructorQuizStatisticsResponse.builder()
              .quiz(quiz)
              .versions(versions)
              .build();
      res.add(ele);
    }

    return res;
  }

  @Override
  public byte[] exportData(UUID quizId, Integer versionNumber) {

    List<QuizSubmissionExportProjection> data;

    if (versionNumber == 0) {

      data = this.quizSubmissionRepository
              .findAllExportByQuiz(quizId);

    } else {

      data = this.quizSubmissionRepository
              .findExportByQuizAndVersion(
                      quizId,
                      versionNumber
              );
    }

    try (
            Workbook workbook = new XSSFWorkbook();
            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream()
    ) {

      Sheet sheet = workbook.createSheet(
              "Quiz Submissions"
      );

      Row header = sheet.createRow(0);

      header.createCell(0)
              .setCellValue("Họ tên");

      header.createCell(1)
              .setCellValue("Email");

      header.createCell(2)
              .setCellValue("SĐT");

      header.createCell(3)
              .setCellValue("Bài thi");

      header.createCell(4)
              .setCellValue("Version");

      header.createCell(5)
              .setCellValue("Tổng câu");

      header.createCell(6)
              .setCellValue("Số đúng");

      header.createCell(7)
              .setCellValue("Điểm");

      header.createCell(8)
              .setCellValue("Nộp lúc");

      int rowNum = 1;

      for (QuizSubmissionExportProjection item : data) {

        Row row = sheet.createRow(rowNum++);

        row.createCell(0).setCellValue(
                item.getLastName()
                        + " "
                        + item.getFirstName()
        );

        row.createCell(1)
                .setCellValue(item.getEmail());

        row.createCell(2)
                .setCellValue(item.getPhoneNumber());

        row.createCell(3)
                .setCellValue(item.getQuizTitle());

        row.createCell(4)
                .setCellValue(item.getVersionNumber());

        row.createCell(5)
                .setCellValue(item.getTotalQuestions());

        row.createCell(6)
                .setCellValue(item.getCorrectAnswers());

        row.createCell(7)
                .setCellValue(item.getScore());

        row.createCell(8).setCellValue(
                item.getSubmittedAt().toString()
        );
      }

      for (int i = 0; i < 9; i++) {
        sheet.autoSizeColumn(i);
      }

      workbook.write(outputStream);

      return outputStream.toByteArray();

    } catch (Exception e) {
      throw new BadRequestException(
              "Xuất file thất bại"
      );
    }
  }

}
