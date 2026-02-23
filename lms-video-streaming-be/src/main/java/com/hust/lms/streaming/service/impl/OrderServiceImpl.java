package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.common.Gen;
import com.hust.lms.streaming.dto.response.order.OrderDetailsResponse;
import com.hust.lms.streaming.dto.response.order.OrderResponse;
import com.hust.lms.streaming.enums.OrderStatus;
import com.hust.lms.streaming.event.custom.CourseEvent;
import com.hust.lms.streaming.event.enums.CourseEventType;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.OrderMapper;
import com.hust.lms.streaming.model.Cart;
import com.hust.lms.streaming.model.CartItem;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Enrollment;
import com.hust.lms.streaming.model.Order;
import com.hust.lms.streaming.model.OrderItem;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.jpa.CartRepository;
import com.hust.lms.streaming.repository.jpa.EnrollmentRepository;
import com.hust.lms.streaming.repository.jpa.OrderRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.service.OrderService;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
  private final OrderRepository orderRepository;
  private final CartRepository cartRepository;
  private final UserRepository userRepository;
  private final EnrollmentRepository enrollmentRepository;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  @Transactional
  public String createOrder() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    User user = this.userRepository.getReferenceById(UUID.fromString(authId));
    Cart cart = this.cartRepository.findByUserId(UUID.fromString(authId)).orElseThrow(() -> new BadRequestException("Dữ liệu không hợp lệ"));
    if (cart.getItems().isEmpty()) {
      throw new BadRequestException("Giỏ hàng đang trống");
    }
    Order order = new Order();
    order.setUser(user);
    order.setStatus(OrderStatus.PENDING);

    BigDecimal totalAmount = BigDecimal.ZERO;

    for (CartItem item : cart.getItems()) {
      Course course = item.getCourse();
      OrderItem orderItem = new OrderItem();
      orderItem.setOrder(order);
      orderItem.setCourse(course);
      BigDecimal price = calculatePrice(course);
      orderItem.setPrice(price);
      totalAmount = totalAmount.add(price);
      order.getItems().add(orderItem);
    }

    order.setTotalAmount(totalAmount);
    LocalDateTime now = LocalDateTime.now();
    order.setExpiresAt(now.plusMinutes(15));
    String codeOrder = Gen.genOrderCode();
    order.setCode(codeOrder);
    order = this.orderRepository.save(order);
    cart.getItems().clear();
    this.cartRepository.save(cart);
    if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
      this.handleOrderFree(order);
    }
    return codeOrder;
  }

  public void handleOrderFree(Order order) {
    order.setCompletedAt(LocalDateTime.now());
    order.setStatus(OrderStatus.COMPLETED);
    List<Enrollment> enrollments = new ArrayList<>();
    for (OrderItem orderItem : order.getItems()) {
      Enrollment enrollment = Enrollment.builder()
          .pricePaid(orderItem.getPrice())
          .course(orderItem.getCourse())
          .user(order.getUser())
          .build();
      enrollments.add(enrollment);
    }
    this.enrollmentRepository.saveAll(enrollments);
    enrollments.forEach(enrollment -> {
      this.eventPublisher.publishEvent(new CourseEvent(CourseEventType.ADD_STUDENT, enrollment.getCourse().getInstructor().getId(), enrollment.getCourse().getId(), null, null ));
    });
  }

  private BigDecimal calculatePrice(Course course) {
    if (course == null) return BigDecimal.ZERO;
    if (course.getSalePrice() == null || course.getSalePrice().compareTo(BigDecimal.ZERO) == 0) return course.getPrice();
    return course.getPrice().subtract(course.getSalePrice());
  }

  @Override
  public OrderDetailsResponse getOrderDetails(String code) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Order order = this.orderRepository.findOrderByCodeAndUserId(code, UUID.fromString(authId)).orElse(null);
    return OrderMapper.mapOrderToOrderDetailsResponse(order);
  }

  @Override
  public List<OrderResponse> getOrders() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    List<Order> orders = this.orderRepository.findOrdersByUserId(UUID.fromString(authId));
    return orders.stream().map(OrderMapper::mapOrderToOrderResponse).toList();
  }


  @Scheduled(cron = "0 * * * * *")
  public void cancelExpiredOrders() {
    List<Order> listOrderPending = this.orderRepository.findOrdersByStatus(OrderStatus.PENDING);
    for (Order order : listOrderPending) {
      if (order.getExpiresAt().isBefore(LocalDateTime.now())) {
        order.setStatus(OrderStatus.CANCELLED);
        this.orderRepository.save(order);
      }
    }
  }
}
