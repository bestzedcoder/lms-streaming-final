package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.dto.response.category.CategoryPublicResponse;
import com.hust.lms.streaming.dto.response.course.CoursePublicDetailsResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.mapper.CategoryMapper;
import com.hust.lms.streaming.mapper.CourseMapper;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.CategoryRepository;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.service.PublicService;
import java.util.List;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PublicServiceImpl implements PublicService {
  private final CategoryRepository categoryRepository;
  private final CourseRepository courseRepository;
  private final RedisService redisService;

  @Override
  public List<CategoryPublicResponse> getCategories() {
    String keyCache = "lms:categories:public:findAll";
    List<CategoryPublicResponse> dataCache = this.redisService.getValue(keyCache, new TypeReference<List<CategoryPublicResponse>>() {});
    if (dataCache != null) {
      return dataCache;
    }

    List<CategoryPublicResponse> res = this.categoryRepository.findAll().stream().map(CategoryMapper::mapCategoryToCategoryPublicResponse).toList();
    this.redisService.saveKeyAndValue(keyCache, res , 10, TimeUnit.MINUTES);
    return res;
  }

  @Override
  public CoursePublicDetailsResponse getCourseDetails(String slug) {
    Course course = this.courseRepository.findBySlugAndStatus(slug, CourseStatus.PUBLISHED).orElse(null);
    return CourseMapper.mapCourseToCoursePublicDetailsResponse(course);
  }

}
