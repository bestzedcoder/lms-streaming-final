package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.CartItem;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
  Optional<CartItem> findByIdAndCartId(UUID id, UUID cartId);
}
