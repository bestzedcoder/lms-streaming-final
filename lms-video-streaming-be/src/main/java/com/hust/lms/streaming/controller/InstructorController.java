package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.instructor.CourseCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.CourseUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.InstructorUpdatingRequest;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.service.InstructorService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

  @GetMapping("{uuid}")
  public ResponseEntity<BaseResponse<?>> getCourse(@PathVariable("uuid") UUID uuid) {
    InstructorCourseResponse res = this.instructorService.getCourse(uuid);
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

  @PostMapping(value = "update-course/{uuid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<BaseResponse<?>> updateCourse(
      @PathVariable("uuid") UUID id,
      @RequestPart("data") @Valid CourseUpdatingRequest req,
      @RequestPart(value = "image", required = false) MultipartFile image) {
    Course res = this.instructorService.updateCourse(id, req, image);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Cập nhật khóa học thành công!")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

}
