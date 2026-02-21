package com.hust.lms.streaming.dto.response.cart;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
  private UUID id;
  private String title;
  private String thumbnail;
  private BigDecimal price;
  private BigDecimal salePrice;
  private String instructorName;
}
