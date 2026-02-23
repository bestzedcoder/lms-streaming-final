package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.response.order.OrderDetailsResponse;
import com.hust.lms.streaming.dto.response.order.OrderResponse;
import com.hust.lms.streaming.service.OrderService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("orders")
@RequiredArgsConstructor
public class OrderController {
  private final OrderService orderService;

  @GetMapping
  public ResponseEntity<BaseResponse<?>> getOrders() {
    List<OrderResponse> res = this.orderService.getOrders();
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("details/{code-order}")
  public ResponseEntity<BaseResponse<?>> getOrderDetails(@PathVariable("code-order") String code) {
    OrderDetailsResponse res = this.orderService.getOrderDetails(code);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping
  public ResponseEntity<BaseResponse<?>> createOrder() {
    String res = this.orderService.createOrder();
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(201)
            .message("success")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }
}
