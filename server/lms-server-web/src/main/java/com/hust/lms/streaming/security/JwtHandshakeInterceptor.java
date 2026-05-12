package com.hust.lms.streaming.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.common.CookieUtils;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.redis.RedisService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtHandshakeInterceptor implements HandshakeInterceptor {
    private final RedisService redisService;
    private final JwtUtils jwtUtils;
    private final CustomizeUserDetailsService userDetailsService;

    @Override
    public boolean beforeHandshake(
            @NotNull ServerHttpRequest request,
            @NotNull ServerHttpResponse response,
            @NotNull WebSocketHandler wsHandler,
            @NotNull Map<String, Object> attributes) throws Exception {
        if (!(request instanceof ServletServerHttpRequest servletRequest)) {
            return false;
        }

        HttpServletRequest httpRequest = servletRequest.getServletRequest();

        String jwt = CookieUtils.getCookieValue(httpRequest, "accessToken");

        if (jwt == null) {
            log.warn("WebSocket handshake rejected: missing accessToken cookie");
            return false;
        }

        try {
            String userEmail = jwtUtils.extractUsername(jwt);

            if (userEmail == null) {
                log.warn("WebSocket handshake rejected: username is null");
                return false;
            }

            String isLogout = redisService.getValue(
                    "lms:auth:blacklist:" + userEmail,
                    new TypeReference<String>() {}
            );

            if ("LOGOUT".equals(isLogout)) {
                throw new BadCredentialsException("Phiên không hợp lệ vui lòng đăng nhập lại!");
            }

            User currentUser = (User) userDetailsService.loadUserByUsername(userEmail);

            if (!currentUser.isAccountNonLocked()) {
                throw new LockedException("Tài khoản của bạn đã bị khóa!");
            }

            if (!jwtUtils.isTokenValid(jwt, currentUser)) {
                log.warn("WebSocket handshake rejected: invalid token for user {}", userEmail);
                return false;
            }

            attributes.put("userId", currentUser.getId().toString());

            return true;

        } catch (ExpiredJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e) {
            log.warn("WebSocket handshake rejected: invalid JWT - {}", e.getMessage());
            return false;
        } catch (LockedException | BadCredentialsException e) {
            log.warn("WebSocket handshake rejected: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("WebSocket handshake error: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, @Nullable Exception exception) {

    }
}
