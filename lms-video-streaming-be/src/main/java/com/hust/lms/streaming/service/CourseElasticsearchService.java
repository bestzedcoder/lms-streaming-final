package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.common.PageResponse;
import com.hust.lms.streaming.model.elasticsearch.CourseDocument;
import com.hust.lms.streaming.model.elasticsearch.CourseDocumentDto;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface CourseElasticsearchService {
  PageResponse<CourseDocument> searchPublicCourses(String keyword, String category, Pageable pageable);
  boolean existsCourse(UUID id);
  void deleteCourse(UUID id);
  void updateCourse(String id, Map<String, Object> data);
  void saveCourse(CourseDocumentDto course);
  void reset();
}
