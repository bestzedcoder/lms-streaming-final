package com.hust.lms.streaming.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.lms.streaming.dto.common.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
  private final ObjectMapper objectMapper;

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
    response.setContentType("application/json");
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setCharacterEncoding("UTF-8");

    ErrorResponse errorResponse = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(401)
        .success(false)
        .message("Bạn chưa đăng nhập hoặc Token không hợp lệ.")
        .path(request.getRequestURI())
        .build();

    response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
  }
}