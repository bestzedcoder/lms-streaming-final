package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.model.User;
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


  @Override
  public void instructorRequestApproval(UUID id) {
    User user = this.userRepository.findById(id).orElse(null);
    if (user == null || !user.getRole().equals(Role.STUDENT)) {
      return;
    }
    user.setRole(Role.INSTRUCTOR);
    this.userRepository.save(user);
  }
}
