package com.hust.lms.streaming.middleware;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.lms.streaming.dto.common.ErrorResponse;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class RateLimitingFilter extends OncePerRequestFilter {

  private final ObjectMapper objectMapper;
  private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

  @Value("${app.rate-limit.capacity:20}")
  private int capacity;

  @Value("${app.rate-limit.duration:60}")
  private int durationInSeconds;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain
  ) throws ServletException, IOException {

    String clientIp = getClientIP(request);

    Bucket bucket = buckets.computeIfAbsent(clientIp, k -> createNewBucket());

    if (bucket.tryConsume(1)) {
      filterChain.doFilter(request, response);
    } else {
      log.warn("Rate limit exceeded for IP: {}", clientIp);
      sendErrorResponse(response);
    }
  }

  private Bucket createNewBucket() {
    Refill refill = Refill.greedy(capacity, Duration.ofSeconds(durationInSeconds));
    Bandwidth limit = Bandwidth.classic(capacity, refill);
    return Bucket.builder().addLimit(limit).build();
  }

  private String getClientIP(HttpServletRequest request) {
    String xfHeader = request.getHeader("X-Forwarded-For");
    if (xfHeader == null || xfHeader.isEmpty()) {
      return request.getRemoteAddr();
    }
    return xfHeader.split(",")[0].trim();
  }

  private void sendErrorResponse(HttpServletResponse response) throws IOException {
    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    ErrorResponse errorResponse = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(HttpStatus.TOO_MANY_REQUESTS.value())
        .success(false)
        .message("Bạn thao tác quá nhanh! Vui lòng thử lại sau giây lát.")
        .path("Rate Limiter")
        .build();

    response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    response.getWriter().flush();
  }
}