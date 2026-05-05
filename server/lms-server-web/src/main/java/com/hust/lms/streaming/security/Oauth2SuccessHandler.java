package com.hust.lms.streaming.security;

import com.hust.lms.streaming.service.OauthHandleService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class Oauth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final OauthHandleService oauth2Handle;
    @Value("${app.origin.client}")
    private String ORIGIN_CLIENT;

    @Override
    public void onAuthenticationSuccess(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");
        this.oauth2Handle.oauth2Handle(email, name, picture, response);
        response.sendRedirect(ORIGIN_CLIENT);
    }
}
