package com.hust.lms.streaming.service;

import com.hust.lms.streaming.model.User;
import java.util.List;

public interface UserService {
  List<User> findAll();
}
