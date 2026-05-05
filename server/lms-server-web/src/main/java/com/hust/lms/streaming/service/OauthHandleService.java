package com.hust.lms.streaming.service;

import jakarta.servlet.http.HttpServletResponse;

public interface OauthHandleService {
    void oauth2Handle(String email, String name, String picture, HttpServletResponse response);
}
