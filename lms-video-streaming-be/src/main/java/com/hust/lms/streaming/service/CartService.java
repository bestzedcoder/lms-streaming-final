package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.cart.AddItemRequest;
import com.hust.lms.streaming.dto.request.cart.RemoveItemRequest;
import com.hust.lms.streaming.dto.response.cart.CartResponse;

public interface CartService {
  void addItem(AddItemRequest request);
  void removeItem(RemoveItemRequest request);
  CartResponse getCart();
}
