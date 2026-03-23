package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.enums.RequestType;
import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.model.Request;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.jpa.RequestRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.service.RequestService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class RequestServiceImpl implements RequestService {
  private final UserRepository userRepository;
  private final RequestRepository requestRepository;

  @Override
  public void handleInstructorRequest(UUID requestId) {
    Request request = this.requestRepository.findByIdAndRequestType(requestId, RequestType.TEACHER_REQUEST).orElse(null);
    if (request == null || !request.getUser().getRole().equals(Role.STUDENT)) return;

    User user = request.getUser();
    user.setRole(Role.INSTRUCTOR);
    this.userRepository.save(user);
  }

  @Override
  public void handleCourseRequest(UUID requestId) {

  }
}
