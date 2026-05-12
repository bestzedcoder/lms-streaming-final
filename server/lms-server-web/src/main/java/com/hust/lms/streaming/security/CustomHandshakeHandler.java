package com.hust.lms.streaming.security;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Component
public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(
            @NotNull ServerHttpRequest request,
            @NotNull WebSocketHandler wsHandler,
            @NotNull Map<String, Object> attributes) {

        String userId = (String) attributes.get("userId");

        if (userId != null) {
            return () -> userId;
        }

        return null;
    }
}
