package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.response.course.CourseAuthDetailsResponse;

public interface CourseService {

  CourseAuthDetailsResponse getCourseDetails(String slug);
}
