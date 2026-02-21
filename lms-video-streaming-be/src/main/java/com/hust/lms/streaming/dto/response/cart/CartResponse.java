package com.hust.lms.streaming.dto.response.cart;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {
  private UUID id;
  @Builder.Default
  private List<CartItemResponse> items = new ArrayList<>();
}
