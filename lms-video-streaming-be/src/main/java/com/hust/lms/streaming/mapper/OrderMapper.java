package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.order.OrderDetailsResponse;
import com.hust.lms.streaming.dto.response.order.OrderItemResponse;
import com.hust.lms.streaming.dto.response.order.OrderResponse;
import com.hust.lms.streaming.model.Order;
import com.hust.lms.streaming.model.OrderItem;

public class OrderMapper {
  private OrderMapper() {
    throw new AssertionError("Utility class");
  }

  public static OrderResponse mapOrderToOrderResponse(Order order) {
    if (order == null) return null;

    OrderResponse response = new OrderResponse();
    response.setId(order.getId());
    response.setOrderDate(order.getCreatedAt());
    response.setStatus(order.getStatus());
    response.setQuantity(order.getItems().size());
    response.setExpiresAt(order.getExpiresAt());
    response.setTotalAmount(order.getTotalAmount());
    response.setCompletedAt(order.getCompletedAt());
    return response;
  }

  public static OrderDetailsResponse mapOrderToOrderDetailsResponse(Order order) {
    if (order == null) return null;

    OrderDetailsResponse response = new OrderDetailsResponse();
    response.setId(order.getId());
    response.setOrderDate(order.getCreatedAt());
    response.setStatus(order.getStatus());
    response.setQuantity(order.getItems().size());
    response.setExpiresAt(order.getExpiresAt());
    response.setTotalAmount(order.getTotalAmount());
    response.setCompletedAt(order.getCompletedAt());
    response.setItems(order.getItems().stream().map(OrderMapper::mapOrderItemToOrderItemResponse).toList());
    return response;
  }

  public static OrderItemResponse mapOrderItemToOrderItemResponse(OrderItem item) {
    if (item == null) return null;

    OrderItemResponse response = new OrderItemResponse();
    response.setId(item.getId());
    response.setPrice(item.getPrice());
    response.setTitle(item.getCourse().getTitle());
    response.setThumbnail(item.getCourse().getThumbnail());
    response.setDescriptionShort(item.getCourse().getDescriptionShort());
    return response;
  }
}
