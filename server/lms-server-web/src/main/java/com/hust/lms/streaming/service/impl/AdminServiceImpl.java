package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.common.CookieUtils;
import com.hust.lms.streaming.dto.common.PageResponse;
import com.hust.lms.streaming.dto.request.auth.LoginRequest;
import com.hust.lms.streaming.dto.response.admin.AdminLecturePreview;
import com.hust.lms.streaming.dto.response.admin.AdminVideoPreview;
import com.hust.lms.streaming.dto.response.admin.CourseOfInstructorResponse;
import com.hust.lms.streaming.dto.response.admin.CoursePendingResponse;
import com.hust.lms.streaming.dto.response.admin.InstructorResponse;
import com.hust.lms.streaming.dto.response.admin.SummaryDashboardResponse;
import com.hust.lms.streaming.dto.response.auth.AdminResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.enums.ResourceStatus;
import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.enums.VideoStatus;
import com.hust.lms.streaming.event.custom.AuthEvent;
import com.hust.lms.streaming.event.custom.CourseEvent;
import com.hust.lms.streaming.event.enums.AuthEventType;
import com.hust.lms.streaming.event.enums.CourseEventType;
import com.hust.lms.streaming.exception.AdminException;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.AdminMapper;
import com.hust.lms.streaming.mapper.AuthMapper;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.Resource;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.model.Video;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.repository.jpa.InstructorRepository;
import com.hust.lms.streaming.repository.jpa.ResourceRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.repository.jpa.VideoRepository;
import com.hust.lms.streaming.security.JwtUtils;
import com.hust.lms.streaming.service.AdminService;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.http.Method;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
  private final CourseRepository courseRepository;
  private final ApplicationEventPublisher eventPublisher;
  private final AuthenticationManager authenticationManager;
  private final UserRepository userRepository;
  private final InstructorRepository instructorRepository;
  private final JwtUtils jwtUtils;
  private final RedisService redisService;
  private final VideoRepository videoRepository;
  private final ResourceRepository resourceRepository;
  private final MinioClient minioClient;

  @Value("${app.security.jwt.accessAdminExpiration}")
  private long accessTokenAdminExpire;

  @Value("${app.storage.s3.bucket-staging}")
  private String stagingBucket;


  @Override
  public void approve(UUID courseId) {
    Course course = this.courseRepository.findById(courseId).orElse(null);
    if (course == null || !course.getStatus().equals(CourseStatus.PENDING)) {
      return;
    }

    course.setStatus(CourseStatus.PRIVATE);
    this.courseRepository.save(course);
    this.eventPublisher.publishEvent(new CourseEvent(CourseEventType.APPROVED_COURSE, course.getInstructor().getId(), courseId, null, null));
  }

  @Override
  public AdminResponse login(LoginRequest data, HttpServletResponse response) {
    Authentication authenticationToken = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getPassword());
    Authentication authentication = authenticationManager.authenticate(authenticationToken);

    SecurityContextHolder.getContext().setAuthentication(authentication);

    String authId =  authentication.getPrincipal().toString();

    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));

    if (!currentUser.getRole().equals(Role.ADMIN)) {
      throw new AdminException("Trang này chỉ có tài khoản admin mới có thể truy cập");
    }

    String accessToken = jwtUtils.generateAccessAdminToken(currentUser);

    this.redisService.deleteKey("lms:auth:blacklist:" + currentUser.getUsername());

    CookieUtils.setCookieValue(response, "accessToken", accessToken, this.accessTokenAdminExpire, "/api/admin");
    return AuthMapper.toAdminResponse(currentUser);
  }

  @Override
  public void logout(HttpServletResponse response) {
    String adminId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    User currentUser = this.userRepository.getReferenceById(UUID.fromString(adminId));

    CookieUtils.setCookieValue(response, "accessToken", null, 0, "/api/admin");

    this.eventPublisher.publishEvent(new AuthEvent(AuthEventType.LOGOUT , currentUser.getEmail() , String.valueOf(this.accessTokenAdminExpire)));
  }

  @Override
  public AdminResponse checkAdmin() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));
    if (!currentUser.getRole().equals(Role.ADMIN)) throw new AdminException("Truy cập trái phép vui lòng login lại!");
    return AuthMapper.toAdminResponse(currentUser);
  }

  @Override
  public List<CoursePendingResponse> getCoursesPending() {
    List<Course> courses = this.courseRepository.findCoursesByStatus(CourseStatus.PENDING);
    return courses.stream().map(AdminMapper::mapCourseToCoursePendingResponse).toList();
  }

  @Override
  public Integer getCoursesPendingCount() {
    return this.courseRepository.countByStatus(CourseStatus.PENDING);
  }

  @Override
  public PageResponse<InstructorResponse> getAllInstructor(int page, int limit, String email) {
    String cacheKey = String.format("lms:admin:get:instructor:page:%d:limit:%d:email:%s", page, limit, email);
    PageResponse<InstructorResponse> dataCache = this.redisService.getValue(cacheKey , new TypeReference<PageResponse<InstructorResponse>>() {});

    if (dataCache != null) {
      return dataCache;
    }

    Pageable pageable = PageRequest.of(page - 1, limit);
    Page<User> data = this.userRepository.findByRoleAndEmailContainingIgnoreCase(Role.INSTRUCTOR, email, pageable);
    PageResponse<InstructorResponse> res = PageResponse.<InstructorResponse>builder()
        .currentPages(page)
        .pageSizes(limit)
        .totalElements(data.getTotalElements())
        .totalPages(data.getTotalPages())
        .result(data.getContent().stream().map(user -> {
          Instructor instructor = this.instructorRepository.findById(user.getId()).orElse(null);
          return AdminMapper.mapInstructorToInstructorResponse(instructor);
        }).toList())
        .build();
    this.redisService.saveKeyAndValue(cacheKey, res, 1, TimeUnit.MINUTES);
    return res;
  }

  @Override
  public void lockCourse(UUID courseId) {
    Course course = this.courseRepository.findById(courseId).orElse(null);
    if (course == null) return;
    course.setStatus(CourseStatus.LOCKED);
    this.courseRepository.save(course);
    this.eventPublisher.publishEvent(new CourseEvent(CourseEventType.LOCKED, course.getInstructor().getId(), courseId, null, null ));
  }

  @Override
  public void unlockCourse(UUID courseId) {
    Course course = this.courseRepository.findById(courseId).orElse(null);
    if (course == null) return;
    course.setStatus(CourseStatus.PRIVATE);
    this.courseRepository.save(course);
    this.eventPublisher.publishEvent(new CourseEvent(CourseEventType.UNLOCKED, course.getInstructor().getId(), courseId, null, null ));
  }

  @Override
  public List<CourseOfInstructorResponse> getCoursesOfInstructor(UUID instructorId) {
    List<Course> data = this.courseRepository.findCoursesByInstructorId(instructorId);
    return data.stream().map(AdminMapper::mapCourseToCourseOfInstructorResponse).toList();
  }

  @Override
  public List<AdminVideoPreview> getVideoPreviews() {
    List<Video> data = this.videoRepository.findByPreview(VideoStatus.PENDING_REVIEW.name());
    return data.stream().map(AdminMapper::mapVideoToAdminVideoPreview).toList();
  }

  @Override
  public List<AdminLecturePreview> getLecturePreviews() {
    List<Resource> data = this.resourceRepository.findByPreview(ResourceStatus.PENDING_REVIEW.name());
    return data.stream().map(AdminMapper::mapResourceToAdminLecturePreview).toList();
  }

  @Override
  public void approveVideo(UUID videoId) {
    Video video = this.videoRepository.findById(videoId).orElse(null);
    if (video == null) return;

    video.setStatus(VideoStatus.PENDING);
    this.videoRepository.save(video);
  }

  @Override
  public void rejectVideo(UUID videoId) {
    Video video = this.videoRepository.findById(videoId).orElse(null);
    if (video == null) return;

    video.setStatus(VideoStatus.DELETED);
    this.videoRepository.save(video);
  }

  @Override
  public void approveLecture(UUID lectureId) {
    Resource resource = this.resourceRepository.findById(lectureId).orElse(null);
    if (resource == null) return;

    resource.setStatus(ResourceStatus.APPROVED);
    this.resourceRepository.save(resource);
  }

  @Override
  public void rejectLecture(UUID lectureId) {
    Resource resource = this.resourceRepository.findById(lectureId).orElse(null);
    if (resource == null) return;

    resource.setStatus(ResourceStatus.DELETED);
    this.resourceRepository.save(resource);
  }

  @Override
  public String getVideoPresignedUrl(UUID videoId) {
    Video video = this.videoRepository.findById(videoId).orElseThrow(() -> new BadRequestException("Video không thể truy cập"));
    try {
      return this.minioClient.getPresignedObjectUrl(
          GetPresignedObjectUrlArgs.builder()
              .method(Method.GET)
              .bucket(stagingBucket)
              .object(video.getOriginalUrl())
              .expiry(15, TimeUnit.MINUTES)
              .build()
      );
    } catch (Exception e) {
      throw new RuntimeException("Lỗi khi tạo link từ MinIO", e);
    }
  }

  @Override
  public String getLecturePresignedUrl(UUID lectureId) {
    Resource resource = this.resourceRepository.findById(lectureId).orElseThrow(() -> new BadRequestException("Lecture không thể truy cập"));
    try {
      return this.minioClient.getPresignedObjectUrl(
          GetPresignedObjectUrlArgs.builder()
              .method(Method.GET)
              .bucket(stagingBucket)
              .object(resource.getUrl())
              .expiry(15, TimeUnit.MINUTES)
              .build()
      );
    } catch (Exception e) {
      throw new RuntimeException("Lỗi khi tạo link từ MinIO", e);
    }
  }

  @Override
  public SummaryDashboardResponse getSummaryDashboard() {
    String cacheKey = "lms:admin:summary:dashboard";
    SummaryDashboardResponse dataCache = this.redisService.getValue(cacheKey, new TypeReference<SummaryDashboardResponse>() {});
    if (dataCache != null) {
      return dataCache;
    }
    long totalStudents = this.userRepository.countByRole(Role.STUDENT);
    long totalTeachers = this.userRepository.countByRole(Role.INSTRUCTOR);
    long totalCourses = this.courseRepository.countByStatus(CourseStatus.PUBLISHED);

    SummaryDashboardResponse res = SummaryDashboardResponse.builder()
        .totalStudents(totalStudents)
        .totalTeachers(totalTeachers)
        .totalCourses(totalCourses)
        .build();
    this.redisService.saveKeyAndValue(cacheKey, res, 1, TimeUnit.MINUTES);
    return res;
  }

}
