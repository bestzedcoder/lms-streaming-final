package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.payment.PaymentCreatingRequest;
import com.hust.lms.streaming.enums.PaymentMethod;
import com.hust.lms.streaming.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("payment")
@RequiredArgsConstructor
public class PaymentController {
  private final PaymentService paymentService;

  @PostMapping("/create")
  public ResponseEntity<BaseResponse<?>> createPayment(
      @RequestBody @Valid PaymentCreatingRequest request,
      @NotNull HttpServletRequest servletRequest) {
    String res = this.paymentService.initPayment(request, servletRequest);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("OK")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  // VNPAY
  @GetMapping("/vn-pay/callback")
  public void callbackVnPay(
    @NotNull HttpServletRequest request,
    @NotNull HttpServletResponse response
  ) {
    this.paymentService.handlePaymentCallback(request, response, PaymentMethod.VNPAY);
  }

  // MOMO
  @GetMapping("/momo/callback")
  public void callbackMomo(
      @NotNull HttpServletRequest request,
      @NotNull HttpServletResponse response
  ) {
    this.paymentService.handlePaymentCallback(request, response, PaymentMethod.MOMO);
  }

}
