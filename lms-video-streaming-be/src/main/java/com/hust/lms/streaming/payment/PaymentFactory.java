package com.hust.lms.streaming.payment;

import com.hust.lms.streaming.enums.PaymentMethod;
import com.hust.lms.streaming.exception.BadRequestException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class PaymentFactory {
  private final Map<PaymentMethod, PaymentStrategy> strategies;

  // Nạp tất cả phương thức thanh toán hiện có
  public PaymentFactory(List<PaymentStrategy> strategyList) {
    strategies = strategyList.stream().collect(Collectors.toMap(PaymentStrategy::getMethod, strategy -> strategy));
  }

  public PaymentStrategy getStrategy(PaymentMethod method) {
    return Optional.ofNullable(strategies.get(method)).orElseThrow(() -> new BadRequestException("Phương thức thanh toán này đang không được hỗ trợ"));
  }
}
