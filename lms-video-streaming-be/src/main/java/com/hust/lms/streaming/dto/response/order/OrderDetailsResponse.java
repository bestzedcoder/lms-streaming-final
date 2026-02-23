package com.hust.lms.streaming.dto.response.order;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailsResponse extends OrderResponse{
  @Builder.Default
  private List<OrderItemResponse> items = new ArrayList<>();
}
