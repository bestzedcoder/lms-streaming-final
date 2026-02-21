package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Cart;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, UUID> {
  boolean existsByUserId(UUID userId);
  Optional<Cart> findByUserId(UUID userId);
}
