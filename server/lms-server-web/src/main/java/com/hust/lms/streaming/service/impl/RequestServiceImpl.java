package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.response.report.InstructorRequestResponse;
import com.hust.lms.streaming.enums.RequestType;
import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.RequestMapper;
import com.hust.lms.streaming.model.Request;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.jpa.RequestRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.service.RequestService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class RequestServiceImpl implements RequestService {
  private final UserRepository userRepository;
  private final RequestRepository requestRepository;

  @Override
  public void createRequestCourse(UUID courseId, String message) {

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

    Request request = new Request();
    request.setUser(user);
    request.setTitle("Xin cấp quyền cho tài khoản");
    request.setDescription(message);
    request.setStatus(false);
    request.setRequestType(RequestType.TEACHER_REQUEST);
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
  }

  @Override
  public void handleCourseRequest(UUID requestId) {

  }

  @Override
  public int countInstructorRequests() {
    return this.requestRepository.countPendingRequests(RequestType.TEACHER_REQUEST.toString());
  }

  @Override
  public List<InstructorRequestResponse> getInstructorRequests() {
    List<Request> data = this.requestRepository.getPendingRequests(RequestType.TEACHER_REQUEST.toString());
    return data.stream().map(RequestMapper::mapRequestToInstructorRequestResponse).toList();
  }
}
