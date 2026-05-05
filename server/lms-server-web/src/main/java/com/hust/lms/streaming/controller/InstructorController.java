package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseListResponse;
import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.instructor.*;
import com.hust.lms.streaming.dto.request.upload.MultipartCompleteRequest;
import com.hust.lms.streaming.dto.request.upload.MultipartInitRequest;
import com.hust.lms.streaming.dto.request.upload.MultipartInitResponse;
import com.hust.lms.streaming.dto.request.upload.ResourceCreatingRequest;
import com.hust.lms.streaming.dto.request.upload.ResourcePreviewResponse;
import com.hust.lms.streaming.dto.request.upload.ResourceUpdatingRequest;
import com.hust.lms.streaming.dto.request.upload.UploadFileRequest;
import com.hust.lms.streaming.dto.request.registration.RegistrationProcessingRequest;
import com.hust.lms.streaming.dto.request.upload.UploadFileResponse;
import com.hust.lms.streaming.dto.request.upload.VideoCreatingRequest;
import com.hust.lms.streaming.dto.request.upload.VideoUpdatingRequest;
import com.hust.lms.streaming.dto.response.instructor.*;
import com.hust.lms.streaming.dto.response.question.QuestionCategoryResponse;
import com.hust.lms.streaming.dto.response.question.QuestionResponse;
import com.hust.lms.streaming.dto.response.quiz.QuizResponse;
import com.hust.lms.streaming.dto.response.quiz.SelectQuizResponse;
import com.hust.lms.streaming.dto.response.registration.RegistrationResponse;
import com.hust.lms.streaming.dto.response.resource.InstructorLectureResponse;
import com.hust.lms.streaming.dto.response.resource.InstructorVideoResponse;
import com.hust.lms.streaming.dto.response.resource.SelectLectureResponse;
import com.hust.lms.streaming.dto.response.resource.SelectVideoResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.service.*;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/instructor")
@RequiredArgsConstructor
public class InstructorController {
  private final InstructorService instructorService;
  private final CourseService courseService;
  private final EnrollmentService enrollmentService;
  private final RegistrationService registrationService;
  private final QuestionService questionService;
  private final S3StorageService s3StorageService;
  private final QuizService quizService;

  @GetMapping
  public ResponseEntity<BaseResponse<?>> getInfo() {
    InstructorInfoResponse res = this.instructorService.getInfo();
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Lấy thành công thông tin!")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping
  public ResponseEntity<BaseResponse<?>> updateInfo(@RequestBody @Valid InstructorUpdatingRequest req) {
    this.instructorService.update(req);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Cập thông tin giảng viên thành công!")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  // Handle Registration

  @GetMapping("registrations")
  public ResponseEntity<BaseListResponse<?>> getRegistrations() {
    List<RegistrationResponse> res = this.registrationService.getPendingRegistrationsByUser();
    return ResponseEntity.ok(BaseListResponse.<RegistrationResponse>builder()
            .code(200)
            .message("Success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("registrations/count")
  public ResponseEntity<BaseResponse<?>> getPendingRegistrationsCount() {
    int res = this.registrationService.countPendingRegistrationsByInstructor();
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("registrations/approve")
  public ResponseEntity<BaseResponse<?>> approveRegistration(@RequestBody @Valid
      RegistrationProcessingRequest request) {
    this.registrationService.approveRegistration(UUID.fromString(request.getRegistrationId()), request.getMessage());
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("registrations/reject")
  public ResponseEntity<BaseResponse<?>> rejectRegistration(@RequestBody @Valid RegistrationProcessingRequest request) {
    this.registrationService.rejectRegistration(UUID.fromString(request.getRegistrationId()), request.getMessage());
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Success")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }


  // Handle Course

  @GetMapping("{uuid}")
  public ResponseEntity<BaseResponse<?>> getCourse(@PathVariable("uuid") UUID uuid) {
    InstructorCourseInfoResponse res = this.courseService.getCourse(uuid);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Lấy thành công thông tin!")
        .data(res)
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("get-courses")
  public ResponseEntity<BaseListResponse<?>> getAllCourses() {
    List<InstructorCourseResponse> res = this.courseService.getAllCourses();
    return ResponseEntity.ok(BaseListResponse.<InstructorCourseResponse>builder()
            .code(200)
            .message("Lấy thành công các khóa học của bạn!")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("courses/{uuid}/get-details")
  public ResponseEntity<BaseResponse<?>> getAllSections(@PathVariable("uuid") UUID id) {
    InstructorCourseDetailsResponse res = this.courseService.getCourseDetails(id);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Lấy thành công thông tin chi tiết khóa học!")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("courses/{uuid}/get-lessons")
  public ResponseEntity<BaseListResponse<?>> getLessonsInCourse(@PathVariable("uuid") UUID courseId) {
    List<InstructorLessonDetailResponse> res = this.courseService.getLessonsInCourse(courseId);
    return ResponseEntity.ok(BaseListResponse.<InstructorLessonDetailResponse>builder()
            .code(200)
            .message("Success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }

  @PostMapping("course/{uuid}/publish")
  public ResponseEntity<BaseResponse<?>> publishCourse(@PathVariable("uuid") UUID id) {
    this.courseService.updateStatusCourse(id, CourseStatus.PUBLISHED);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Khóa học đã được hiển thị công khai!")
        .success(true)
        .build());
  }

  @PostMapping("course/{uuid}/unpublish")
  public ResponseEntity<BaseResponse<?>> unpublishCourse(@PathVariable("uuid") UUID id) {
    this.courseService.updateStatusCourse(id, CourseStatus.PRIVATE);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Khóa học đã được chuyển về chế độ riêng tư!")
        .success(true)
        .build());
  }

  @PostMapping(value = "add-course", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<BaseResponse<?>> addCourse(
      @RequestPart("data") @Valid CourseCreatingRequest req,
      @RequestPart(value = "image", required = false) MultipartFile image) {
    this.courseService.createCourse(req, image);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(201)
            .message("Tạo khóa học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping(value = "update-course", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<BaseResponse<?>> updateCourse(
      @RequestPart("data") @Valid CourseUpdatingRequest req,
      @RequestPart(value = "image", required = false) MultipartFile image) {
    this.courseService.updateCourse(req, image);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Cập nhật khóa học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("add-section")
  public ResponseEntity<BaseResponse<?>> addSection(@RequestBody @Valid SectionCreatingRequest req) {
    this.courseService.addSection(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(201)
            .message("Thêm chương học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("update-section")
  public ResponseEntity<BaseResponse<?>> updateSection(@RequestBody @Valid SectionUpdatingRequest req) {
    this.courseService.updateSection(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Cập nhật chương học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @DeleteMapping("delete-section")
  public ResponseEntity<BaseResponse<?>> deleteSection(@RequestBody @Valid SectionCancelRequest req) {
    this.courseService.deleteSection(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Xóa chương học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("add-lesson")
  public ResponseEntity<BaseResponse<?>> addLesson(@RequestBody @Valid LessonCreatingRequest req) {
    this.courseService.addLesson(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(201)
            .message("Thêm bài học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("update-lesson")
  public ResponseEntity<BaseResponse<?>> updateLesson(@RequestBody @Valid LessonUpdatingRequest req) {
    this.courseService.updateLesson(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Cập nhật bài học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @DeleteMapping("delete-lesson")
  public ResponseEntity<BaseResponse<?>> deleteLesson(@RequestBody @Valid LessonCancelRequest req) {
    this.courseService.deleteLesson(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Xóa bài học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }


  // enrollments

  @PostMapping("enrollments/user-banned")
  public ResponseEntity<BaseResponse<?>> banned(@RequestBody @Valid BannedRequest req) {
    UUID userId = UUID.fromString(req.getUserId());
    UUID courseId = UUID.fromString(req.getCourseId());
    this.enrollmentService.banEnrollment(courseId, userId, req.getReason());
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("enrollments/user-active")
  public ResponseEntity<BaseResponse<?>> active(@RequestBody @Valid ActiveRequest req) {
    UUID userId = UUID.fromString(req.getUserId());
    UUID courseId = UUID.fromString(req.getCourseId());
    this.enrollmentService.activeEnrollment(courseId, userId);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Success")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  // Question

  @GetMapping("questions")
  public ResponseEntity<BaseListResponse<?>> getQuestions(@RequestParam("q") UUID q) {
    List<QuestionResponse> res =  this.questionService.getQuestions(q);
    return ResponseEntity.ok(BaseListResponse.<QuestionResponse>builder()
            .code(200)
            .message("Success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("questions/create")
  public ResponseEntity<BaseResponse<?>> createQuestion(@RequestBody @Valid QuestionCreatingRequest req) {
    this.questionService.createQuestion(UUID.fromString(req.getCategoryId()), req.getType(), req.getContent(), req.getOptions());
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .success(true)
            .message("Success")
            .code(201)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("questions/update")
  public ResponseEntity<BaseResponse<?>> updateQuestion(@RequestBody @Valid
  QuestionUpdatingRequest req) {
    this.questionService.updateQuestion(UUID.fromString(req.getId()), req.getType(), req.getContent(), req.getOptions());
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @DeleteMapping("questions/delete/{id}")
  public ResponseEntity<BaseResponse<?>> deleteQuestion(@PathVariable("id") UUID questionId) {
    this.questionService.deleteQuestion(questionId);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Success")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("questions/get-categories")
  public ResponseEntity<BaseListResponse<?>> getCategories() {
    List<QuestionCategoryResponse> res = this.questionService.getQuestionCategories();
    return ResponseEntity.ok(BaseListResponse.<QuestionCategoryResponse>builder()
            .code(200)
            .message("Success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("questions/create-category")
  public ResponseEntity<BaseResponse<?>> createCategory(@RequestBody @Valid QuestionCategoryCreatingRequest req) {
    this.questionService.createCategory(req.getName());
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("questions/update-category")
  public ResponseEntity<BaseResponse<?>> updateCategory(@RequestBody @Valid QuestionCategoryUpdatingRequest req) {
    this.questionService.updateCategory(UUID.fromString(req.getCategoryId()), req.getName());
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
        .code(200)
        .message("Success")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @DeleteMapping("questions/delete-category/{id}")
  public ResponseEntity<BaseResponse<?>> deleteCategory(@PathVariable("id") UUID categoryId) {
    this.questionService.deleteCategory(categoryId);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  // upload

  @PostMapping("storage/presigned-url")
  public ResponseEntity<BaseResponse<?>> uploadFile(@RequestBody @Valid UploadFileRequest req) {
    UploadFileResponse res = this.s3StorageService.requestUploadLecture(req.getFileName());
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("storage/init-multipart")
  public ResponseEntity<BaseResponse<?>> initMultipartVideo(@RequestBody @Valid MultipartInitRequest req) {
    MultipartInitResponse res = this.s3StorageService.initMultipartVideo(req);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Khởi tạo multipart upload thành công")
        .data(res)
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("storage/complete-multipart")
  public ResponseEntity<BaseResponse<?>> completeMultipartVideo(@RequestBody @Valid MultipartCompleteRequest req) {
    this.s3StorageService.completeMultipartVideo(req);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Tải video lên và ghép file thành công")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("storage/create-video")
  public ResponseEntity<BaseResponse<?>> createVideo(@RequestBody @Valid VideoCreatingRequest req) {
    this.instructorService.createVideoRecord(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(HttpStatus.CREATED.value())
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("storage/create-resource")
  public ResponseEntity<BaseResponse<?>> createResource(@RequestBody @Valid ResourceCreatingRequest req) {
    this.instructorService.createResourceRecord(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
        .code(HttpStatus.CREATED.value())
        .message("Success")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping(value = "storage/update-video" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<BaseResponse<?>> updateVideo(
      @RequestPart("data") @Valid VideoUpdatingRequest req,
      @RequestPart(value = "image", required = false) MultipartFile image ) {
    this.instructorService.updateVideoRecord(req, image);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Success")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("storage/update-resource")
  public ResponseEntity<BaseResponse<?>> updateResource(@RequestBody @Valid ResourceUpdatingRequest req) {
    this.instructorService.updateResourceRecord(req);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Success")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("resources/get-videos")
  public ResponseEntity<BaseListResponse<?>> getVideos() {
    List<InstructorVideoResponse> res = this.s3StorageService.getInstructorVideoList();
    return ResponseEntity.ok(BaseListResponse.<InstructorVideoResponse>builder()
            .code(200)
            .message("Success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("resources/get-lectures")
  public ResponseEntity<BaseListResponse<?>> getLectures() {
    List<InstructorLectureResponse> res = this.s3StorageService.getInstructorLectureList();
    return ResponseEntity.ok(BaseListResponse.<InstructorLectureResponse>builder()
        .code(200)
        .message("Success")
        .data(res)
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("resources/preview-video/{id}")
  public ResponseEntity<BaseResponse<?>> previewVideo(@PathVariable("id") UUID videoId) {
    ResourcePreviewResponse res = this.s3StorageService.generateVideoPreviewUrl(videoId);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("resources/preview-lecture/{id}")
  public ResponseEntity<BaseResponse<?>> previewLecture(@PathVariable("id") UUID lectureId) {
    ResourcePreviewResponse res = this.s3StorageService.generateLecturePreviewUrl(lectureId);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Success")
        .data(res)
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("resources/prepare-select/get-videos")
  public ResponseEntity<BaseListResponse<?>> getSelectVideos() {
    List<SelectVideoResponse> res = this.courseService.getAllVideo();
    return ResponseEntity.ok(BaseListResponse.<SelectVideoResponse>builder()
                    .code(200)
                    .message("Success")
                    .data(res)
                    .success(true)
                    .timestamp(LocalDateTime.now())
            .build());
  }

  @GetMapping("resources/prepare-select/get-lectures")
  public ResponseEntity<BaseListResponse<?>> getSelectLectures() {
    List<SelectLectureResponse> res = this.courseService.getAllLecture();
    return ResponseEntity.ok(BaseListResponse.<SelectLectureResponse>builder()
            .code(200)
            .message("Success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }

  @GetMapping("resources/prepare-select/get-quizzes")
  public ResponseEntity<BaseListResponse<?>> getSelectQuizzes() {
    List<SelectQuizResponse> res = this.courseService.getAllQuiz();
    return ResponseEntity.ok(BaseListResponse.<SelectQuizResponse>builder()
            .code(200)
            .message("Success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }

  // add Resource for Lesson
  @PostMapping("lesson/add-resource")
  public ResponseEntity<BaseResponse<?>> addResource(@RequestBody @Valid AddResourceForLesson req) {
    this.courseService.addResourceForLesson(
            UUID.fromString(req.getCourseId()),
            UUID.fromString(req.getLessonId()),
            UUID.fromString(req.getResourceId()),
            req.getType());
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }

  @PostMapping("lesson/remove-resource")
  public ResponseEntity<BaseResponse<?>> removeResource(@RequestBody @Valid RemoveResourceForLesson req) {
    this.courseService.removeResourceForLesson(
            UUID.fromString(req.getCourseId()),
            UUID.fromString(req.getLessonId())
            );
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }

  // Quizzes

  @GetMapping("quizzes")
  public ResponseEntity<BaseListResponse<?>> getQuizzes() {
    List<QuizResponse> res = this.quizService.getQuizzes();
    return ResponseEntity.ok(BaseListResponse.<QuizResponse>builder()
                    .code(200)
                    .message("Success")
                    .data(res)
                    .success(true)
                    .timestamp(LocalDateTime.now())
            .build());
  }

  @PostMapping("quizzes/handle-create")
  public ResponseEntity<BaseResponse<?>> createQuiz(@RequestBody @Valid QuizCreatingRequest req) {
    this.quizService.createQuiz(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
                    .code(HttpStatus.CREATED.value())
                    .message("Success")
                    .success(true)
                    .timestamp(LocalDateTime.now())
            .build());
  }

  @PostMapping("quizzes/handle-update")
  public ResponseEntity<BaseResponse<?>> updateQuiz(@RequestBody @Valid QuizUpdatingRequest req) {
    this.quizService.updateQuiz(req);
    return ResponseEntity.ok(BaseResponse.builder()
                    .code(200)
                    .message("Success")
                    .success(true)
                    .timestamp(LocalDateTime.now())
            .build());
  }

  @DeleteMapping("quizzes/handle-delete/{id}")
  public ResponseEntity<BaseResponse<?>> deleteQuiz(@PathVariable("id") UUID quizId) {
    this.quizService.deleteQuiz(quizId);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }

  @PostMapping("quizzes/add-question")
  public ResponseEntity<BaseResponse<?>> addQuizQuestion(@RequestBody @Valid AddQuizQuestionRequest req) {
    this.quizService.addQuizQuestion(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }

  @PostMapping("quizzes/remove-question")
  public ResponseEntity<BaseResponse<?>> removeQuizQuestion(@RequestBody @Valid RemoveQuizQuestionRequest req) {
    this.quizService.removeQuizQuestion(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
            .build());
  }
}
