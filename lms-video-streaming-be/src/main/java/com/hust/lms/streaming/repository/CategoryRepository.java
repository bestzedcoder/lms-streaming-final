package com.hust.lms.streaming.repository;

import com.hust.lms.streaming.model.Category;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
  boolean existsBySlug(String slug);
  boolean existsByName(String name);
  Optional<Category> findBySlug(String slug);
}
