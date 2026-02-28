package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.common.PaymentUtils;
import com.hust.lms.streaming.dto.request.payment.PaymentCreatingRequest;
import com.hust.lms.streaming.enums.OrderStatus;
import com.hust.lms.streaming.enums.PaymentMethod;
import com.hust.lms.streaming.enums.PaymentStatus;
import com.hust.lms.streaming.event.custom.CourseEvent;
import com.hust.lms.streaming.event.enums.CourseEventType;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.model.Enrollment;
import com.hust.lms.streaming.model.Order;
import com.hust.lms.streaming.model.OrderItem;
import com.hust.lms.streaming.model.Payment;
import com.hust.lms.streaming.payment.PaymentData;
import com.hust.lms.streaming.payment.PaymentFactory;
import com.hust.lms.streaming.repository.jpa.EnrollmentRepository;
import com.hust.lms.streaming.repository.jpa.OrderRepository;
import com.hust.lms.streaming.repository.jpa.PaymentRepository;
import com.hust.lms.streaming.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
  private final OrderRepository orderRepository;
  private final PaymentRepository paymentRepository;
  private final PaymentFactory paymentFactory;
  private final EnrollmentRepository enrollmentRepository;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  public String initPayment(PaymentCreatingRequest request, HttpServletRequest servletRequest) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Order order = this.orderRepository.findOrderByCodeAndUserId(request.getCode(), UUID.fromString(authId)).orElseThrow(() -> new BadRequestException("Đơn hàng không tồn tại."));
    if (!order.getStatus().equals(OrderStatus.PENDING)) throw new BadRequestException("Đơn hàng không hợp lệ.");

    Payment payment = Payment.builder()
        .order(order)
        .amount(order.getTotalAmount())
        .paymentMethod(request.getMethod())
        .status(PaymentStatus.PENDING)
        .build();
    this.paymentRepository.save(payment);

    PaymentData data = PaymentData.builder()
        .orderCode(order.getCode())
        .amount(order.getTotalAmount().longValue())
        .orderInfo("Thanh toan don hang "+ order.getCode())
        .ipAddress(PaymentUtils.getIpAddress(servletRequest))
        .build();
    return paymentFactory.getStrategy(request.getMethod()).createPaymentUrl(data);
  }

  @Override
  public void handlePaymentCallback(HttpServletRequest request, HttpServletResponse response, PaymentMethod method) {
    Map<String, String> params = new HashMap<>();
    request.getParameterMap().forEach((key, value) -> params.put(key, value[0]));

      String orderCode = (method == PaymentMethod.VNPAY)
          ? params.get("vnp_TxnRef")
          : params.get("orderId");

      String responseCode = (method == PaymentMethod.VNPAY)
          ? params.get("vnp_ResponseCode")
          : params.get("resultCode");

      Payment payment = paymentRepository.findByOrderCode(orderCode);

      if ("00".equals(responseCode) || "0".equals(responseCode)) {
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionNo(params.get("vnp_TransactionNo"));
        Order order = payment.getOrder();
        order.setStatus(OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());
        List<Enrollment> enrollments = new ArrayList<>();
        for (OrderItem item : order.getItems()) {
          Enrollment enrollment = Enrollment.builder()
              .user(order.getUser())
              .course(item.getCourse())
              .pricePaid(item.getPrice())
              .build();
          enrollments.add(enrollment);
        }
        this.enrollmentRepository.saveAll(enrollments);

        for (Enrollment enrollment : enrollments) {
          this.eventPublisher.publishEvent(new CourseEvent(CourseEventType.ADD_STUDENT, enrollment.getCourse().getInstructor().getId(), enrollment.getCourse().getId(), null, null));
        }

      } else {
        payment.setStatus(PaymentStatus.FAILED);
        payment.getOrder().setStatus(OrderStatus.CANCELLED);
      }

      paymentRepository.save(payment);
      orderRepository.save(payment.getOrder());
  }

}
