package com.hust.lms.streaming.event.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.*;

import java.security.Principal;

@Component
@Slf4j
public class WebSocketListener {

    /**
     * User CONNECT websocket thành công
     */
    @EventListener
    public void handleWebSocketConnectListener(
            SessionConnectEvent event
    ) {
        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        Principal principal = accessor.getUser();

        if (principal != null) {
            log.info(
                    "WebSocket connected -> userId={}",
                    principal.getName()
            );
        }
    }

    /**
     * User SUBSCRIBE vào channel
     */
    @EventListener
    public void handleWebSocketSubscribeListener(
            SessionSubscribeEvent event
    ) {
        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        Principal principal = accessor.getUser();

        String destination = accessor.getDestination();

        if (principal != null) {
            log.info(
                    "User [{}] subscribed to [{}]",
                    principal.getName(),
                    destination
            );
        }
    }

    /**
     * User UNSUBSCRIBE khỏi channel
     */
    @EventListener
    public void handleWebSocketUnsubscribeListener(
            SessionUnsubscribeEvent event
    ) {
        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        Principal principal = accessor.getUser();

        if (principal != null) {
            log.info(
                    "User [{}] unsubscribed",
                    principal.getName()
            );
        }
    }

    /**
     * User DISCONNECT websocket
     */
    @EventListener
    public void handleWebSocketDisconnectListener(
            SessionDisconnectEvent event
    ) {
        Principal principal = event.getUser();

        if (principal != null) {
            log.info(
                    "WebSocket disconnected -> userId={}",
                    principal.getName()
            );
        }
    }
}