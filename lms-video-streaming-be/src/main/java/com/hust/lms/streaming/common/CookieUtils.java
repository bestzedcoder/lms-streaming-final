package com.hust.lms.streaming.common;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtils {
  public String getCookieValue(HttpServletRequest request, String name) {
    Cookie[] cookies = request.getCookies();

    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if (cookie.getName().equals(name)) {
          return cookie.getValue();
        }
      }
    }
    return null;
  }

  public void setCookieValue(HttpServletResponse response, String name, String value, long expires, String path) {
    ResponseCookie cookie = ResponseCookie
        .from(name, value)
        .maxAge(expires)
        .sameSite("Lax")
        .secure(false)
        .path(path)
        .build();
    response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }
}
