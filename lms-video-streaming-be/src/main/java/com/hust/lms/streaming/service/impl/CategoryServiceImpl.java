package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.request.category.CategoryCreatingRequest;
import com.hust.lms.streaming.dto.request.category.CategoryUpdatingRequest;
import com.hust.lms.streaming.dto.response.category.CategoryResponse;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.exception.ResourceNotFoundException;
import com.hust.lms.streaming.mapper.CategoryMapper;
import com.hust.lms.streaming.model.Category;
import com.hust.lms.streaming.repository.jpa.CategoryRepository;
import com.hust.lms.streaming.service.CategoryService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
  private final CategoryRepository categoryRepository;

  @Override
  public List<CategoryResponse> findAll() {
    return this.categoryRepository.findAll().stream().map(CategoryMapper::mapCategoryToCategoryResponse).toList();
  }

  @Override
  public void create(CategoryCreatingRequest request) {
    if (this.categoryRepository.existsBySlug(request.getSlug()) || this.categoryRepository.existsByName(request.getName())) {
      throw new BadRequestException("Danh mục này đã tồn tại");
    }

    Category category = Category.builder()
        .name(request.getName())
        .slug(request.getSlug())
        .icon(request.getIcon())
        .build();

    this.categoryRepository.save(category);
  }

  @Override
  public void update(UUID id ,CategoryUpdatingRequest request) {
    if (this.categoryRepository.existsBySlug(request.getSlug()) || this.categoryRepository.existsByName(request.getName())) {
      throw new BadRequestException("Danh mục này đã tồn tại");
    }

    Category category = this.categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category" , "id", id));

    category.setName(request.getName());
    category.setSlug(request.getSlug());
    category.setIcon(request.getIcon());
    this.categoryRepository.save(category);
  }

  @Override
  public void delete(UUID id) {
    Category category = this.categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category" , "id", id));
    this.categoryRepository.delete(category);
  }
}
