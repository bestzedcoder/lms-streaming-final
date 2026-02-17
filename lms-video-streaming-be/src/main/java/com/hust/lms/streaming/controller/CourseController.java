package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("courses")
@RequiredArgsConstructor
public class CourseController {
  private final CourseService courseService;
}
