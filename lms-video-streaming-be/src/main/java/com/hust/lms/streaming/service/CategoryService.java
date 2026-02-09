package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.category.CategoryCreatingRequest;
import com.hust.lms.streaming.dto.request.category.CategoryUpdatingRequest;
import com.hust.lms.streaming.dto.response.category.CategoryResponse;
import java.util.List;
import java.util.UUID;

public interface CategoryService {
  List<CategoryResponse> findAll();
  void create(CategoryCreatingRequest request);
  void update(UUID id ,CategoryUpdatingRequest request);
  void delete(UUID id);
}
