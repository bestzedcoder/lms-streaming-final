package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.common.CookieUtils;
import com.hust.lms.streaming.common.Gen;
import com.hust.lms.streaming.event.custom.UserEvent;
import com.hust.lms.streaming.event.enums.UserEventType;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.security.JwtUtils;
import com.hust.lms.streaming.service.OauthHandleService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OauthHandleServiceImpl implements OauthHandleService {

    @Value("${app.security.jwt.refreshExpiration}")
    private long REFRESH_TOKEN_EXPIRE_TIME;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final RedisService redisService;
    private final JwtUtils jwtUtils;

    @Override
    public void oauth2Handle(String email, String name, String picture, HttpServletResponse response) {
        User user;
        if (!this.userRepository.existsByEmail(email)) {
            String rawPassword = Gen.genPasswordRaw(10);
            String hasPassword = this.passwordEncoder.encode(rawPassword);
            String[] fullName = name.split(" ");
            user = this.userRepository.save(User.builder()
                    .email(email)
                    .password(hasPassword)
                    .avatarUrl(picture)
                    .firstName(fullName[1])
                    .lastName(fullName[0])
                    .enabled(true)
                    .build());
            this.eventPublisher.publishEvent(new UserEvent(UserEventType.CREATED, user.getEmail() , rawPassword));
        } else {
            user = this.userRepository.findByEmail(email).orElse(null);
            if (user == null) return;
            this.redisService.deleteKey("lms:auth:blacklist:" + user.getUsername());
        }
        String accessToken = jwtUtils.generateAccessToken(user);
        String refreshToken = jwtUtils.generateRefreshToken(user);

        CookieUtils.setCookieValue(response, "refreshToken", refreshToken, REFRESH_TOKEN_EXPIRE_TIME, "/api/auth/refresh");
        CookieUtils.setCookieValue(response, "accessToken", accessToken, REFRESH_TOKEN_EXPIRE_TIME, "/api");
    }
}
