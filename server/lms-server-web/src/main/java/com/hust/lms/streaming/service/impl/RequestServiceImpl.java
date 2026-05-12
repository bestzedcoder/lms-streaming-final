package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.dto.message.NotificationMessage;
import com.hust.lms.streaming.dto.response.report.CourseRequestResponse;
import com.hust.lms.streaming.dto.response.report.InstructorRequestResponse;
import com.hust.lms.streaming.dto.response.report.RequestResponse;
import com.hust.lms.streaming.enums.*;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.RequestMapper;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Request;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.repository.jpa.EnrollmentRepository;
import com.hust.lms.streaming.repository.jpa.RequestRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.service.NotificationService;
import com.hust.lms.streaming.service.RequestService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class RequestServiceImpl implements RequestService {
  private final UserRepository userRepository;
  private final EnrollmentRepository enrollmentRepository;
  private final CourseRepository courseRepository;
  private final RequestRepository requestRepository;
  private final NotificationService notificationService;
  private final RedisService redisService;

  @Override
  public void createRequestCourse(String slug, String message) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    if (!this.enrollmentRepository.existsByUserIdAndCourseSlug(UUID.fromString(authId), slug)) {
      throw new BadRequestException("Truy cập không hợp lệ");
    }

    if (this.requestRepository.existsByUserAndCourseSlug(UUID.fromString(authId), RequestType.COURSE_REPORT.toString(), slug)) {
      throw new BadRequestException("Yêu cầu này đã được gửi vui lòng chờ xử lý");
    }

    Course course = this.courseRepository.findBySlugAndStatus(slug, CourseStatus.PUBLISHED)
            .orElseThrow(() -> new BadRequestException("Khóa học đang ở trạng thái không hợp lệ"));
    User user = this.userRepository.getReferenceById(UUID.fromString(authId));

    Request request = Request.builder()
            .title(RequestContent.COURSE_REPORT.value)
            .requestType(RequestType.COURSE_REPORT)
            .description(message)
            .targetId(course.getId())
            .status(false)
            .user(user)
            .build();
    this.requestRepository.save(request);
  }

  @Override
  public void createRequestInstructor(String message) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    User user = this.userRepository.findById(UUID.fromString(authId)).orElse(null);

    if (user == null || user.getRole() != Role.STUDENT) {
      throw new BadRequestException("Yêu cầu không hợp lệ");
    }

    if (this.requestRepository.existsByUser(UUID.fromString(authId), RequestType.TEACHER_REQUEST.toString())) {
      throw new BadRequestException("Yêu cầu này đã được gửi vui lòng chờ xử lý");
    }

    Request request = Request.builder()
            .user(user)
            .title(RequestContent.TEACHER_REQUEST.value)
            .description(message)
            .status(false)
            .requestType(RequestType.TEACHER_REQUEST)
            .build();
    this.requestRepository.save(request);
  }

  @Override
  public void handleInstructorRequest(UUID requestId) {
    Request request = this.requestRepository.findByIdAndRequestType(requestId, RequestType.TEACHER_REQUEST).orElse(null);
    if (request == null || request.getStatus() || !request.getUser().getRole().equals(Role.STUDENT)) return;

    User user = request.getUser();
    user.setRole(Role.INSTRUCTOR);

    request.setStatus(true);
    request.setResolvedAt(LocalDateTime.now());

    this.userRepository.save(user);
    this.requestRepository.save(request);

    this.notificationService.sendToStudent(user.getId(), NotificationMessage.builder()
            .type(NotificationType.TEACHER_REQUEST_APPROVED)
            .title("Cập nhập trạng thái phê duyệt làm giáo viên")
            .content("Yêu cầu đã được phê duyệt")
            .createdAt(LocalDateTime.now())
            .build());
  }

  @Override
  public void handleCourseRequest(UUID requestId) {
    System.out.println("Giải quyết yêu cầu: " + requestId);
  }

  @Override
  public int countInstructorRequests() {
    return this.requestRepository.countPendingRequests(RequestType.TEACHER_REQUEST.toString());
  }

  @Override
  public int countCourseRequests() {
    return this.requestRepository.countPendingRequests(RequestType.COURSE_REPORT.toString());
  }


  @Override
  public List<InstructorRequestResponse> getInstructorRequests() {
    List<Request> data = this.requestRepository.getPendingRequests(RequestType.TEACHER_REQUEST.toString());
    return data.stream().map(RequestMapper::mapRequestToInstructorRequestResponse).toList();
  }

  @Override
  public List<CourseRequestResponse> getCourseRequests() {
    List<Request> data = this.requestRepository.getPendingRequests(RequestType.COURSE_REPORT.toString());
    return data.stream().map(RequestMapper::mapRequestToCourseRequestResponse).toList();
  }

  @Override
  public List<RequestResponse> getRequests() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    String keyCache = "lms:request:student:" + authId;

    List<RequestResponse> dataCache = this.redisService.getValue(keyCache, new TypeReference<List<RequestResponse>>() {});
    if (dataCache != null) return dataCache;

    List<Request> data = this.requestRepository.findRequestsByStudent(UUID.fromString(authId));
    List<RequestResponse> res = data.stream().map(RequestMapper::mapRequestToRequestResponse).toList();

    this.redisService.saveKeyAndValue(keyCache, res, 1, TimeUnit.MINUTES);
    return res;
  }
}
