package com.hust.lms.streaming.middleware;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.lms.streaming.dto.common.ErrorResponse;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.security.JwtUtils;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

  private final JwtUtils jwtUtils;
  private final UserDetailsService userDetailsService;
  private final ObjectMapper objectMapper;
  private final RedisService redisService;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain
  ) throws ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");
    final String jwt;
    final String userEmail;

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      jwt = authHeader.substring(7);
      userEmail = jwtUtils.extractUsername(jwt);

      if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        // Kiểm tra trong blacklist
        String tokenBlock = this.redisService.getValue("lms:auth:blacklist:email" + userEmail, new TypeReference<String>() {});
        if (tokenBlock != null && tokenBlock.equals(jwt)) {
          throw new BadRequestException("Phiên đăng nhập không hợp lệ, vui lòng login lại");
        }

        UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
        if (!((User)userDetails).isAccountNonLocked()) {
          throw new LockedException("Tài khoản của bạn đã bị khóa!");
        }
        if (jwtUtils.isTokenValid(jwt, userDetails)) {
          UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
              userDetails,
              null,
              userDetails.getAuthorities()
          );

          authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authToken);
        }
      }
      filterChain.doFilter(request, response);
    } catch (ExpiredJwtException e) {
      log.error("JWT Expired: {}", e.getMessage());
      sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Phiên đăng nhập đã hết hạn.");
    } catch (MalformedJwtException | SignatureException | IllegalArgumentException e) {
      log.error("JWT Invalid: {}", e.getMessage());
      sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Token không hợp lệ.");
    } catch (LockedException e) {
      sendError(response, HttpServletResponse.SC_FORBIDDEN, e.getMessage());
    } catch (BadRequestException e) {
      sendError(response, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
    } catch (Exception e) {
      log.error("JWT Filter Error: {}", e.getMessage());
      sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Lỗi xác thực hệ thống: " + e.getMessage());
    }
  }

  /**
   * Hàm helper để trả về JSON ErrorResponse ngay lập tức
   */
  private void sendError(HttpServletResponse response, int statusCode, String message) throws IOException {
    response.setStatus(statusCode);
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    ErrorResponse errorResponse = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(statusCode)
        .success(false)
        .message(message)
        .path("JwtFilter")
        .build();

    response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    response.getWriter().flush();
  }
}