package com.hust.lms.streaming.middleware;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Order(2)
@Component
@Slf4j
public class LoggingFilter extends OncePerRequestFilter {

  private static final int MAX_BODY_LENGTH = 1000;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    // Chỉ wrap nếu không phải là các request upload file (multipart) để tránh tốn memory
    if (isAsyncDispatch(request) || isMultipartRequest(request)) {
      filterChain.doFilter(request, response);
      return;
    }

    ContentCachingRequestWrapper reqWrapper = new ContentCachingRequestWrapper(request);
    ContentCachingResponseWrapper respWrapper = new ContentCachingResponseWrapper(response);

    long startTime = System.currentTimeMillis();

    try {
      filterChain.doFilter(reqWrapper, respWrapper);
    } finally {
      long timeTaken = System.currentTimeMillis() - startTime;
      logRequestResponse(reqWrapper, respWrapper, timeTaken);
      respWrapper.copyBodyToResponse();
    }
  }

  // Trong class LoggingFilter.java
  private void logRequestResponse(ContentCachingRequestWrapper req, ContentCachingResponseWrapper resp, long time) {
    // Thu thập các thông tin cần thiết
    String method = req.getMethod();
    String uri = req.getRequestURI();
    String queryString = (req.getQueryString() != null) ? "?" + req.getQueryString() : "";
    String ip = getClientIp(req);
    int status = resp.getStatus();

    // Format Body (Sử dụng hàm formatBody bạn đã viết)
    String requestBody = formatBody(req.getContentAsByteArray(), req.getCharacterEncoding());
    String responseBody = formatBody(resp.getContentAsByteArray(), resp.getCharacterEncoding());

    // CHỈ GHI 1 DÒNG LOG DUY NHẤT CHỨA CẢ REQ VÀ RESP
    log.info("REQ [{} {}{}] IP=[{}] Body=[{}] | RESP [{}] Time=[{}ms] Body=[{}]",
        method, uri, queryString, ip, requestBody, status, time, responseBody);
  }

  private String getClientIp(HttpServletRequest request) {
    String[] headers = {"X-Forwarded-For", "Proxy-Client-IP", "WL-Proxy-Client-IP", "HTTP_CLIENT_IP", "HTTP_X_FORWARDED_FOR"};
    for (String header : headers) {
      String ip = request.getHeader(header);
      if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
        return ip.split(",")[0];
      }
    }
    return request.getRemoteAddr();
  }

  private String formatBody(byte[] content, String encoding) {
    if (content == null || content.length == 0) return "[]";

    String charset = (encoding != null) ? encoding : StandardCharsets.UTF_8.name();
    String body = new String(content, StandardCharsets.UTF_8); // Luôn dùng UTF-8 để tránh lỗi font log

    // Làm sạch format: xóa xuống dòng, tab
    body = body.replaceAll("[\\n\\t\\r]", " ").trim();

    if (body.length() > MAX_BODY_LENGTH) {
      return body.substring(0, MAX_BODY_LENGTH) + "...(truncated)";
    }
    return body;
  }

  private boolean isMultipartRequest(HttpServletRequest request) {
    return request.getContentType() != null && request.getContentType().startsWith("multipart/form-data");
  }
}