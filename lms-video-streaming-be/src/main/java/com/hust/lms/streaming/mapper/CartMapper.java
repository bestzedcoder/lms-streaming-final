package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.cart.CartItemResponse;
import com.hust.lms.streaming.dto.response.cart.CartResponse;
import com.hust.lms.streaming.model.Cart;
import com.hust.lms.streaming.model.CartItem;

public class CartMapper {
  private CartMapper() {
    throw new AssertionError("Utility class");
  }

  public static CartResponse mapCartToCartResponse(Cart cart) {
    if (cart == null) return null;

    CartResponse response = new CartResponse();
    response.setId(cart.getId());
    response.setItems(cart.getItems().stream().map(CartMapper::mapCartItemToCartItemResponse).toList());
    return response;
  }

  public static CartItemResponse mapCartItemToCartItemResponse(CartItem cartItem) {
    if (cartItem == null) return null;

    CartItemResponse response = new CartItemResponse();
    response.setId(cartItem.getId());
    response.setPrice(cartItem.getCourse().getPrice());
    response.setSalePrice(cartItem.getCourse().getSalePrice());
    response.setTitle(cartItem.getCourse().getTitle());
    response.setThumbnail(cartItem.getCourse().getThumbnail());
    return response;
  }
}
