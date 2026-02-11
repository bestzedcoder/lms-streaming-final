package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.request.instructor.CourseCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.CourseUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.InstructorUpdatingRequest;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.exception.ResourceNotFoundException;
import com.hust.lms.streaming.mapper.InstructorMapper;
import com.hust.lms.streaming.model.Category;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.CategoryRepository;
import com.hust.lms.streaming.repository.CourseRepository;
import com.hust.lms.streaming.repository.InstructorRepository;
import com.hust.lms.streaming.repository.UserRepository;
import com.hust.lms.streaming.service.InstructorService;
import com.hust.lms.streaming.upload.CloudinaryService;
import com.hust.lms.streaming.upload.CloudinaryUploadResult;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {
  private final InstructorRepository instructorRepository;
  private final CourseRepository courseRepository;
  private final CategoryRepository categoryRepository;
  private final CloudinaryService cloudinaryService;
  private final UserRepository userRepository;

  @Override
  public Instructor update(InstructorUpdatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));

    Instructor instructor = this.instructorRepository.findById(currentUser.getId()).orElse(
        Instructor.builder()
            .user(currentUser)
            .build()
    );

    instructor.setTitle(request.getTitle());
    instructor.setBio(request.getBio());
    return this.instructorRepository.save(instructor);
  }

  @Override
  public Course createCourse(CourseCreatingRequest request, MultipartFile image) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));

    Instructor instructor = this.instructorRepository.findById(currentUser.getId()).orElseThrow(() -> new BadRequestException("Chưa cập nhật thông tin giảng viên!"));

    if (this.courseRepository.existsBySlug(request.getSlug())) {
      throw new BadRequestException("Khóa học tên khóa học đã tồn tại!");
    }

    Category category = this.categoryRepository.findBySlug(request.getCategorySlug()).orElseThrow(() -> new BadRequestException("Danh mục này không tồn tại!"));

    Course course = Course.builder()
        .title(request.getTitle())
        .slug(request.getSlug())
        .description(request.getDescription())
        .level(request.getLevel())
        .category(category)
        .instructor(instructor)
        .build();

    if (image != null) {
      CloudinaryUploadResult res = this.cloudinaryService.uploadImage(image, "courses");
      course.setThumbnail(res.getUrl());
      course.setPublicId(res.getPublicId());
    }

    instructor.getCourses().add(course);
    this.instructorRepository.save(instructor);
    return course;
  }

  @Override
  public Course updateCourse(UUID id, CourseUpdatingRequest request, MultipartFile image) {
    Course course = this.courseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
    if (!course.getSlug().equals(request.getSlug()) && this.courseRepository.existsBySlug(request.getSlug())) {
      throw new BadRequestException("Slug đã tồn tại");
    }

    course.setTitle(request.getTitle());
    course.setSlug(request.getSlug());
    course.setDescription(request.getDescription());
    course.setLevel(request.getLevel());
    course.setPrice(request.getPrice());
    course.setSalePrice(request.getSalePrice());
    if (image != null) {
      if (course.getThumbnail() != null) this.cloudinaryService.deleteImage(course.getPublicId());
      CloudinaryUploadResult res = this.cloudinaryService.uploadImage(image, "courses");
      course.setThumbnail(res.getUrl());
      course.setPublicId(res.getPublicId());
    }
    return this.courseRepository.save(course);
  }

  @Override
  public InstructorInfoResponse getInfo() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));

    Instructor instructor = this.instructorRepository.findById(currentUser.getId()).orElse(null);

    return InstructorMapper.mapInstructorToInstructorInfoResponse(instructor);
  }

  @Override
  public InstructorCourseResponse getCourse(UUID id) {
    Course course = this.courseRepository.findById(id).orElse(null);
    return InstructorMapper.mapInstructorToInstructorCourseResponse(course);
  }
}
