package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.response.category.CategoryPublicResponse;
import com.hust.lms.streaming.mapper.CategoryMapper;
import com.hust.lms.streaming.repository.CategoryRepository;
import com.hust.lms.streaming.service.PublicService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PublicServiceImpl implements PublicService {
  private final CategoryRepository categoryRepository;

  @Override
  public List<CategoryPublicResponse> getCategories() {
    return this.categoryRepository.findAll().stream().map(CategoryMapper::mapCategoryToCategoryPublicResponse).toList();
  }

}
