package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.enums.OrderStatus;
import com.hust.lms.streaming.model.Order;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
  Optional<Order> findOrderByCodeAndUserId(String code, UUID userId);
  List<Order> findOrdersByStatus(OrderStatus status);
  List<Order> findOrdersByUserId(UUID userId);
}
