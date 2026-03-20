package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.response.category.CategoryPublicResponse;
import com.hust.lms.streaming.dto.response.course.CoursePublicDetailsResponse;
import java.util.List;

public interface PublicService {
  List<CategoryPublicResponse> getCategories();
  CoursePublicDetailsResponse getCourseDetails(String slug);
}
