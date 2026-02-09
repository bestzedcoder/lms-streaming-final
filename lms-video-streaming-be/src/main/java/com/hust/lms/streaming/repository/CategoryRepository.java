package com.hust.lms.streaming.repository;

import com.hust.lms.streaming.model.Category;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
  boolean existsBySlug(String slug);
  boolean existsByName(String name);
}
