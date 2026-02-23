package com.hust.lms.streaming.controller;


import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.cart.AddItemRequest;
import com.hust.lms.streaming.dto.request.cart.RemoveItemRequest;
import com.hust.lms.streaming.dto.response.cart.CartResponse;
import com.hust.lms.streaming.service.CartService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("carts")
@RequiredArgsConstructor
public class CartController {
  private final CartService cartService;

  @PostMapping("add-item")
  public ResponseEntity<BaseResponse<?>> addCartItem(@RequestBody @Valid AddItemRequest req) {
    this.cartService.addItem(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(201)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("remove-item")
  public ResponseEntity<BaseResponse<?>> removeCartItem(@RequestBody @Valid RemoveItemRequest req) {
    this.cartService.removeItem(req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("my-cart")
  public ResponseEntity<BaseResponse<?>> getMyCart() {
    CartResponse res = this.cartService.getCart();
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping("clear")
  public ResponseEntity<BaseResponse<?>> clearCart() {
    this.cartService.clearCart();
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Success")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }
}
