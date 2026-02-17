package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.dto.request.instructor.CourseCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.CourseStatusRequest;
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
import com.hust.lms.streaming.event.custom.CourseEvent;
import com.hust.lms.streaming.event.enums.CourseEventType;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.exception.ResourceAccessDeniedException;
import com.hust.lms.streaming.mapper.InstructorMapper;
import com.hust.lms.streaming.model.Category;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.Lesson;
import com.hust.lms.streaming.model.Section;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.CategoryRepository;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.repository.jpa.InstructorRepository;
import com.hust.lms.streaming.repository.jpa.LessonRepository;
import com.hust.lms.streaming.repository.jpa.SectionRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.service.InstructorService;
import com.hust.lms.streaming.upload.CloudinaryService;
import com.hust.lms.streaming.upload.CloudinaryUploadResult;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
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
  private final SectionRepository sectionRepository;
  private final LessonRepository lessonRepository;
  private final ApplicationEventPublisher eventPublisher;
  private final RedisService redisService;

  private User getCurrentUser() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    return this.userRepository.getReferenceById(UUID.fromString(authId));
  }

  @Override
  public Instructor update(InstructorUpdatingRequest request) {
    User currentUser = this.getCurrentUser();
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
    User currentUser = this.getCurrentUser();

    Instructor instructor = this.instructorRepository.findById(currentUser.getId()).orElseThrow(() -> new BadRequestException("Chưa cập nhật thông tin giảng viên!"));

    if (this.courseRepository.existsBySlug(request.getSlug())) {
      throw new BadRequestException("Slug của khóa học đã tồn tại!");
    }

    Category category = this.categoryRepository.findBySlug(request.getCategorySlug()).orElseThrow(() -> new BadRequestException("Danh mục này không tồn tại!"));

    Course course = Course.builder()
        .title(request.getTitle())
        .slug(request.getSlug())
        .description(request.getDescription())
        .descriptionShort(request.getDescriptionShort())
        .requirements(request.getRequirements())
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
    this.eventPublisher.publishEvent(new CourseEvent<>(CourseEventType.CREATED , currentUser.getId(), null , null));
    return course;
  }

  @Override
  public Course updateCourse(CourseUpdatingRequest request, MultipartFile image) {
    UUID id = UUID.fromString(request.getId());
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Course course = this.courseRepository.findByIdAndInstructorId(id, UUID.fromString(authId)).orElseThrow(ResourceAccessDeniedException::new);

    course.setTitle(request.getTitle());
    course.setDescriptionShort(request.getDescriptionShort());
    course.setRequirements(request.getRequirements());
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

    Instructor instructor = this.instructorRepository.findById(UUID.fromString(authId)).orElse(null);

    return InstructorMapper.mapInstructorToInstructorInfoResponse(instructor);
  }

  @Override
  public InstructorCourseInfoResponse getCourse(UUID id) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Course course = this.courseRepository.findByIdAndInstructorId(id, UUID.fromString(authId)).orElse(null);
    return InstructorMapper.mapCourseToInstructorCourseInfoResponse(course);
  }

  @Override
  public Boolean isUploadInstructor() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    return this.instructorRepository.existsById(UUID.fromString(authId));
  }

  @Override
  public void addSection(SectionCreatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    UUID courseId = UUID.fromString(request.getCourseId());
    Course course = this.courseRepository.findByIdAndInstructorId(courseId, UUID.fromString(authId)).orElseThrow(ResourceAccessDeniedException::new);

    int countSection = course.getSections().size();
    int sectionIndex = countSection == 0 ? 1 : course.getSections().get(countSection - 1).getOrderIndex() + 1;

    Section section = Section.builder()
        .title(request.getTitle())
        .descriptionShort(request.getDescriptionShort())
        .orderIndex(sectionIndex)
        .course(course)
        .build();

    course.getSections().add(section);

    this.courseRepository.save(course);
  }

  @Override
  public void updateSection(SectionUpdatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    UUID courseId = UUID.fromString(request.getCourseId());
    UUID sectionId = UUID.fromString(request.getSectionId());

    if (!this.courseRepository.existsByIdAndInstructorId(courseId, UUID.fromString(authId))) {
      throw new ResourceAccessDeniedException();
    }

    Section section = this.sectionRepository.findByIdAndCourseId(sectionId, courseId).orElseThrow(ResourceAccessDeniedException::new);

    section.setTitle(request.getTitle());
    section.setDescriptionShort(request.getDescriptionShort());

    this.sectionRepository.save(section);
  }

  @Override
  public void deleteSection(SectionCancelRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    UUID courseId = UUID.fromString(request.getCourseId());
    UUID sectionId = UUID.fromString(request.getSectionId());

    if (!this.courseRepository.existsByIdAndInstructorId(courseId, UUID.fromString(authId))) {
      throw new ResourceAccessDeniedException();
    }

    Section section = this.sectionRepository.findByIdAndCourseId(sectionId, courseId).orElseThrow(ResourceAccessDeniedException::new);

    if (!section.getLessons().isEmpty()) {
      throw new BadRequestException("Phải xóa hết bài học trước khi xóa chương học");
    }

    this.sectionRepository.delete(section);
  }

  @Override
  public void addLesson(LessonCreatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    UUID courseId = UUID.fromString(request.getCourseId());
    UUID sectionId = UUID.fromString(request.getSectionId());

    if (!this.courseRepository.existsByIdAndInstructorId(courseId, UUID.fromString(authId))) {
      throw new ResourceAccessDeniedException();
    }

    Section section = this.sectionRepository.findByIdAndCourseId(sectionId, courseId).orElseThrow(ResourceAccessDeniedException::new);

    int countLesson = section.getLessons().size();
    int lessonIndex = countLesson == 0 ? 1 : section.getLessons().get(countLesson - 1).getOrderIndex() + 1;

    Lesson lesson = Lesson.builder()
        .title(request.getTitle())
        .lessonType(request.getLessonType())
        .isPreview(request.isPreview())
        .orderIndex(lessonIndex)
        .section(section)
        .build();

    section.getLessons().add(lesson);
    this.sectionRepository.save(section);
  }

  @Override
  public void updateLesson(LessonUpdatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    UUID courseId = UUID.fromString(request.getCourseId());
    UUID sectionId = UUID.fromString(request.getSectionId());
    UUID lessonId = UUID.fromString(request.getLessonId());

    if (!this.courseRepository.existsByIdAndInstructorId(courseId, UUID.fromString(authId)) || !this.sectionRepository.existsByIdAndCourseId(sectionId, courseId)) {
      throw new ResourceAccessDeniedException();
    }

    Lesson lesson = this.lessonRepository.findByIdAndSectionId(lessonId, sectionId).orElseThrow(ResourceAccessDeniedException::new);

    lesson.setTitle(request.getTitle());
    lesson.setLessonType(request.getLessonType());
    lesson.setIsPreview(request.isPreview());
    this.lessonRepository.save(lesson);
  }

  @Override
  public void deleteLesson(LessonCancelRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    UUID courseId = UUID.fromString(request.getCourseId());
    UUID sectionId = UUID.fromString(request.getSectionId());
    UUID lessonId = UUID.fromString(request.getLessonId());

    if (!this.courseRepository.existsByIdAndInstructorId(courseId, UUID.fromString(authId)) || !this.sectionRepository.existsByIdAndCourseId(sectionId, courseId)) {
      throw new ResourceAccessDeniedException();
    }

    Lesson lesson = this.lessonRepository.findByIdAndSectionId(lessonId, sectionId).orElseThrow(ResourceAccessDeniedException::new);

    this.lessonRepository.delete(lesson);
  }

  @Override
  public List<InstructorCourseResponse> getAllCourses() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    String cacheKey = "lms:instructor:list:course:" + authId;
    List<InstructorCourseResponse> cacheData = this.redisService.getValue(cacheKey, new TypeReference<List<InstructorCourseResponse>>() {});
    if (cacheData != null) {
      return cacheData;
    }
    List<Course> courses = this.courseRepository.findByInstructorId(UUID.fromString(authId));
    List<InstructorCourseResponse> res = courses.stream().map(InstructorMapper::mapCourseToInstructorCourseResponse).toList();
    this.redisService.saveKeyAndValue(cacheKey, res, 5, TimeUnit.MINUTES);
    return res;
  }

  @Override
  public InstructorCourseDetailsResponse getCourseDetails(UUID id) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Course course = this.courseRepository.findByIdAndInstructorId(id, UUID.fromString(authId)).orElseThrow(ResourceAccessDeniedException::new);
    return InstructorMapper.mapCourseToInstructorCourseDetailsResponse(course);
  }

  @Override
  public void updateStatusCourse(CourseStatusRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    UUID courseId = UUID.fromString(request.getId());

    Course course = this.courseRepository.findByIdAndInstructorId(courseId, UUID.fromString(authId)).orElseThrow(ResourceAccessDeniedException::new);

    if (course.getStatus().equals(CourseStatus.PENDING)) throw new BadRequestException("Khóa học đang trong trạng thái xét duyệt");

    if (course.getStatus().equals(CourseStatus.LOCKED)) throw new BadRequestException("Khóa học đang bị khóa vui lòng liên hệ quản trị viên");

    if (request.getStatus().equals(CourseStatus.PENDING) || request.getStatus().equals(CourseStatus.LOCKED)) {
      throw new BadRequestException("Trạng thái cập nhật khóa học không hợp lệ");
    }

    course.setStatus(request.getStatus());
    this.courseRepository.save(course);
  }

}
