package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseListResponse;
import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.instructor.CourseCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.CourseUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.InstructorUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.LessonCancelRequest;
import com.hust.lms.streaming.dto.request.instructor.LessonCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.LessonUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.SectionCancelRequest;
import com.hust.lms.streaming.dto.request.instructor.SectionCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.SectionUpdatingRequest;
import com.hust.lms.streaming.dto.request.registration.RegistrationProcessingRequest;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseDetailsResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseInfoResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.dto.response.registration.RegistrationResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.service.CourseService;
import com.hust.lms.streaming.service.InstructorService;
import com.hust.lms.streaming.service.RegistrationService;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/instructor")
@RequiredArgsConstructor
public class InstructorController {
  private final InstructorService instructorService;
  private final CourseService courseService;
  private final RegistrationService registrationService;

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
  public ResponseEntity<BaseListResponse<?>> getRegistrations(
  ) {
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

}
