package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.response.order.OrderDetailsResponse;
import com.hust.lms.streaming.dto.response.order.OrderResponse;
import java.util.List;

public interface OrderService {
  String createOrder();
  OrderDetailsResponse getOrderDetails(String code);
  List<OrderResponse> getOrders();
}
