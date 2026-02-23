package com.hust.lms.streaming.dto.response.order;

import com.hust.lms.streaming.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
  private UUID id;
  private BigDecimal totalAmount;
  private int quantity;
  private OrderStatus status;
  private LocalDateTime orderDate;
  private LocalDateTime expiresAt;
  private LocalDateTime completedAt;
}