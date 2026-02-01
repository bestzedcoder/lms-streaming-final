package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.UserRepository;
import com.hust.lms.streaming.service.UserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;

  @Override
  public List<User> findAll() {
    return this.userRepository.findAll();
  }
}
