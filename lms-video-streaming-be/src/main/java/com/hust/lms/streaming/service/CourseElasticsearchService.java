package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.common.PageResponse;
import com.hust.lms.streaming.model.elasticsearch.CourseDocument;
import org.springframework.data.domain.Pageable;

public interface CourseElasticsearchService {
  PageResponse<CourseDocument> searchPublicCourses(String keyword, String category, Pageable pageable);
}
