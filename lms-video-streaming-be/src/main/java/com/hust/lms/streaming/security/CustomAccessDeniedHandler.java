package com.hust.lms.streaming.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.lms.streaming.dto.common.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

  private final ObjectMapper objectMapper;

  @Override
  public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
    response.setContentType("application/json");
    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
    response.setCharacterEncoding("UTF-8");

    ErrorResponse errorResponse = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(403)
        .success(false)
        .message("Bạn không có quyền truy cập vào tài nguyên này.")
        .path(request.getRequestURI())
        .build();

    response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
  }
}
