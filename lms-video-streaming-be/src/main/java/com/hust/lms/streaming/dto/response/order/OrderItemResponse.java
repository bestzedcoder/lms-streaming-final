package com.hust.lms.streaming.dto.response.order;

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
public class OrderItemResponse {
  private UUID id;
  private BigDecimal price;
  private String title;
  private String thumbnail;
  private String descriptionShort;
}
