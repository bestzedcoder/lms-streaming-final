package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.category.CategoryPublicResponse;
import com.hust.lms.streaming.dto.response.category.CategoryResponse;
import com.hust.lms.streaming.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
  public CategoryResponse mapCategoryToCategoryResponse(Category category) {
    CategoryResponse response = new CategoryResponse();
    response.setId(category.getId().toString());
    response.setName(category.getName());
    response.setSlug(category.getSlug());
    response.setIcon(category.getIcon());
    response.setCreatedAt(category.getCreatedAt());
    response.setUpdatedAt(category.getUpdatedAt());
    response.setUpdatedBy(category.getUpdatedBy());
    return response;
  }

  public CategoryPublicResponse mapCategoryToCategoryPublicResponse(Category category) {
    CategoryPublicResponse response = new CategoryPublicResponse();
    response.setId(category.getId().toString());
    response.setName(category.getName());
    response.setSlug(category.getSlug());
    return response;
  }
}
