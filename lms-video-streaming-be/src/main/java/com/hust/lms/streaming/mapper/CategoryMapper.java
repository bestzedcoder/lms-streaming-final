package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.category.CategoryPublicResponse;
import com.hust.lms.streaming.dto.response.category.CategoryResponse;
import com.hust.lms.streaming.model.Category;

public class CategoryMapper {
  private CategoryMapper() {
    throw new AssertionError("Utility class");
  }

  public static CategoryResponse mapCategoryToCategoryResponse(Category category) {
    if (category == null) return null;

    CategoryResponse response = new CategoryResponse();
    response.setId(category.getId());
    response.setName(category.getName());
    response.setSlug(category.getSlug());
    response.setIcon(category.getIcon());
    response.setCreatedAt(category.getCreatedAt());
    response.setUpdatedAt(category.getUpdatedAt());
    response.setUpdatedBy(category.getUpdatedBy());
    return response;
  }

  public static CategoryPublicResponse mapCategoryToCategoryPublicResponse(Category category) {
    if (category == null) return null;

    CategoryPublicResponse response = new CategoryPublicResponse();
    response.setId(category.getId());
    response.setName(category.getName());
    response.setSlug(category.getSlug());
    return response;
  }
}
