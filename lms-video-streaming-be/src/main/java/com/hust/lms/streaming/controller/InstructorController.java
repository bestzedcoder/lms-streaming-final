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
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseDetailsResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseInfoResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.service.InstructorService;
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
@RequestMapping("instructor")
@RequiredArgsConstructor
public class InstructorController {
  private final InstructorService instructorService;

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

  @GetMapping("check-info")
  public ResponseEntity<BaseResponse<?>> checkInfo() {
    Boolean res = this.instructorService.isUploadInstructor();
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Lấy thành công thông tin!")
        .data(res)
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("{uuid}")
  public ResponseEntity<BaseResponse<?>> getCourse(@PathVariable("uuid") UUID uuid) {
    InstructorCourseInfoResponse res = this.instructorService.getCourse(uuid);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Lấy thành công thông tin!")
        .data(res)
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping
  public ResponseEntity<BaseResponse<?>> update(@RequestBody @Valid InstructorUpdatingRequest req) {
    Instructor res = this.instructorService.update(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Cập thông tin giảng viên thành công!")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("get-courses")
  public ResponseEntity<BaseListResponse<?>> getAllCourses() {
    List<InstructorCourseResponse> res = this.instructorService.getAllCourses();
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
    InstructorCourseDetailsResponse res = this.instructorService.getCourseDetails(id);
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
    this.instructorService.updateStatusCourse(id, CourseStatus.PUBLISHED);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Khóa học đã được hiển thị công khai!")
        .success(true)
        .build());
  }

  @PostMapping("course/{uuid}/unpublish")
  public ResponseEntity<BaseResponse<?>> unpublishCourse(@PathVariable("uuid") UUID id) {
    this.instructorService.updateStatusCourse(id, CourseStatus.PRIVATE);
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
    Course res = this.instructorService.createCourse(req, image);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(201)
            .message("Tạo khóa học thành công!")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping(value = "update-course", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<BaseResponse<?>> updateCourse(
      @RequestPart("data") @Valid CourseUpdatingRequest req,
      @RequestPart(value = "image", required = false) MultipartFile image) {
    Course res = this.instructorService.updateCourse(req, image);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Cập nhật khóa học thành công!")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("add-section")
  public ResponseEntity<BaseResponse<?>> addSection(@RequestBody @Valid SectionCreatingRequest req) {
    this.instructorService.addSection(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(201)
            .message("Thêm chương học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("update-section")
  public ResponseEntity<BaseResponse<?>> updateSection(@RequestBody @Valid SectionUpdatingRequest req) {
    this.instructorService.updateSection(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Cập nhật chương học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @DeleteMapping("delete-section")
  public ResponseEntity<BaseResponse<?>> deleteSection(@RequestBody @Valid SectionCancelRequest req) {
    this.instructorService.deleteSection(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Xóa chương học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("add-lesson")
  public ResponseEntity<BaseResponse<?>> addLesson(@RequestBody @Valid LessonCreatingRequest req) {
    this.instructorService.addLesson(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(201)
            .message("Thêm bài học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("update-lesson")
  public ResponseEntity<BaseResponse<?>> updateLesson(@RequestBody @Valid LessonUpdatingRequest req) {
    this.instructorService.updateLesson(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Cập nhật bài học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @DeleteMapping("delete-lesson")
  public ResponseEntity<BaseResponse<?>> deleteLesson(@RequestBody @Valid LessonCancelRequest req) {
    this.instructorService.deleteLesson(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Xóa bài học thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }


}
