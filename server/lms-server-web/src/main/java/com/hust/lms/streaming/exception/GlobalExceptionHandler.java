package com.hust.lms.streaming.exception;

import com.hust.lms.streaming.dto.common.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  // Bắt lỗi Đăng nhập sai
  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException e, WebRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(HttpStatus.UNAUTHORIZED.value())
        .success(false)
        .message("Tài khoản hoặc mật khẩu không chính xác!")
        .path(request.getDescription(false).replace("uri=", ""))
        .build();
    return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
  }

  // Bắt lỗi Tài khoản bị khóa (locked = true)
  @ExceptionHandler(LockedException.class)
  public ResponseEntity<ErrorResponse> handleLockedException(LockedException e, WebRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(1001) // 403
        .success(false)
        .message(e.getMessage())
        .path(request.getDescription(false).replace("uri=", ""))
        .build();
    return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
  }

  // Bắt lỗi Tài khoản chưa kích hoạt
  @ExceptionHandler(DisabledException.class)
  public ResponseEntity<ErrorResponse> handleDisabledException(DisabledException e, WebRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(1001)
        .success(false)
        .message("Tài khoản chưa được kích hoạt.")
        .path(request.getDescription(false).replace("uri=", ""))
        .build();
    return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
  }

  // Bắt lỗi truy cập admin trái phép
  @ExceptionHandler(AdminException.class)
  public ResponseEntity<ErrorResponse> handleAdminException(AdminException e, WebRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(2000)
        .success(false)
        .message(e.getMessage())
        .path(request.getDescription(false).replace("uri=", ""))
        .build();
    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
  }

  // Bắt lỗi truy cập tài nguyên trái phép
  @ExceptionHandler(ResourceAccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleResourceAccessDeniedException(ResourceAccessDeniedException e, WebRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(403)
        .success(false)
        .message(e.getMessage())
        .path(request.getDescription(false).replace("uri=", ""))
        .build();
    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
  }

  // Bắt lỗi Validate dữ liệu
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e, WebRequest request) {
    Map<String, String> errors = new HashMap<>();
    e.getBindingResult().getFieldErrors().forEach(error ->
        errors.put(error.getField(), error.getDefaultMessage())
    );

    String message = "Dữ liệu không hợp lệ: " + errors.toString();

    ErrorResponse error = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(HttpStatus.BAD_REQUEST.value())
        .success(false)
        .message(message)
        .path(request.getDescription(false).replace("uri=", ""))
        .build();
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  // Bắt lỗi xử lý logic nghiệp vụ sai
  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException e, WebRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(HttpStatus.BAD_REQUEST.value())
        .success(false)
        .message(e.getMessage())
        .path(request.getDescription(false).replace("uri=", ""))
        .build();
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  // Bắt lỗi khi không tồn tại tài nguyên cần tìm kiếm
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException e, WebRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(HttpStatus.NOT_FOUND.value())
        .success(false)
        .message(e.getMessage())
        .path(request.getDescription(false).replace("uri=", ""))
        .build();
    return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
  }

  // Bắt các lỗi còn lại
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGlobalException(Exception e, WebRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(LocalDateTime.now())
        .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .success(false)
        .message("Lỗi hệ thống: " + e.getMessage())
        .path(request.getDescription(false).replace("uri=", ""))
        .build();
    return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }

}