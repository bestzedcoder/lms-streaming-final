package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.request.cart.AddItemRequest;
import com.hust.lms.streaming.dto.request.cart.RemoveItemRequest;
import com.hust.lms.streaming.dto.response.cart.CartResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.CartMapper;
import com.hust.lms.streaming.model.Cart;
import com.hust.lms.streaming.model.CartItem;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.jpa.CartItemRepository;
import com.hust.lms.streaming.repository.jpa.CartRepository;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.service.CartService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
  private final CartRepository cartRepository;
  private final CartItemRepository cartItemRepository;
  private final UserRepository userRepository;
  private final CourseRepository courseRepository;

  @Override
  public void addItem(AddItemRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    User user = this.userRepository.getReferenceById(UUID.fromString(authId));
    Course course = this.courseRepository.findBySlugAndStatus(request.getCourseSlug(), CourseStatus.PUBLISHED).orElseThrow(() -> new BadRequestException("Khóa học không còn công khai hoặc không tồn tại"));
    Cart cart = this.cartRepository.findByUserId(UUID.fromString(authId)).orElse(
        Cart.builder()
            .user(user)
            .build()
    );
    boolean isAlreadyInCart = cart.getItems().stream()
        .anyMatch(cartItem -> cartItem.getCourse() != null &&
            cartItem.getCourse().getId().equals(course.getId()));

    if (isAlreadyInCart) {
      throw new BadRequestException("Khóa học này đã có trong giỏ hàng của bạn!");
    }

    CartItem cartItem = new CartItem();
    cartItem.setCart(cart);
    cartItem.setCourse(course);
    cart.getItems().add(cartItem);
    this.cartRepository.save(cart);
  }

  @Override
  public void removeItem(RemoveItemRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    UUID cartItemId = UUID.fromString(request.getCartItemId());
    Cart cart = this.cartRepository.findByUserId(UUID.fromString(authId)).orElseThrow(() -> new BadRequestException("Lỗi xóa sản phẩm không hợp lệ"));
    CartItem cartItem = this.cartItemRepository.findByIdAndCartId(cartItemId, cart.getId()).orElse(null);
    if (cartItem == null) {
      return;
    }
    cart.getItems().remove(cartItem);
    this.cartRepository.save(cart);
  }

  @Override
  public CartResponse getCart() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Cart cart = this.cartRepository.findByUserId(UUID.fromString(authId)).orElse(null);
    return CartMapper.mapCartToCartResponse(cart);
  }
}
