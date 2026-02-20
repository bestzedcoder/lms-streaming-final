package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.common.CookieUtils;
import com.hust.lms.streaming.common.Gen;
import com.hust.lms.streaming.dto.request.auth.ChangePasswordRequest;
import com.hust.lms.streaming.dto.request.auth.ForgotPasswordRequest;
import com.hust.lms.streaming.dto.request.auth.ResetPasswordRequest;
import com.hust.lms.streaming.dto.request.auth.SignUpRequest;
import com.hust.lms.streaming.dto.request.auth.VerifyAccountRequest;
import com.hust.lms.streaming.dto.response.auth.LoginResponse;
import com.hust.lms.streaming.dto.response.auth.RefreshResponse;
import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.event.custom.AuthEvent;
import com.hust.lms.streaming.event.enums.AuthEventType;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.exception.ResourceNotFoundException;
import com.hust.lms.streaming.mapper.AuthMapper;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.security.JwtUtils;
import com.hust.lms.streaming.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
  private final AuthenticationManager authenticationManager;
  private final JwtUtils jwtUtils;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final RedisService redisService;
  private final ApplicationEventPublisher eventPublisher;
  private final CookieUtils cookieUtils;

  @Value("${app.security.jwt.accessExpiration}")
  private long accessTokenExpireTime;
  @Value("${app.security.jwt.refreshExpiration}")
  private long refreshTokenExpireTime;

  @Override
  public LoginResponse login(HttpServletResponse response,String email, String password) {

    Authentication authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
    Authentication authentication = authenticationManager.authenticate(authenticationToken);

    SecurityContextHolder.getContext().setAuthentication(authentication);

    String authId =  authentication.getPrincipal().toString();

    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));

    String accessToken = jwtUtils.generateAccessToken(currentUser);
    String refreshToken = jwtUtils.generateRefreshToken(currentUser);

    this.redisService.deleteKey("lms:auth:blacklist:" + currentUser.getUsername());

//    ResponseCookie cookie =  ResponseCookie.from("refreshToken" , refreshToken)
//        .maxAge(this.refreshTokenExpireTime)
//        .secure(false)
//        .httpOnly(true)
//        .path("/api/auth")
//        .sameSite("Lax")
//        .build();
//    response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    this.cookieUtils.setCookieValue(response, "refreshToken", refreshToken, this.refreshTokenExpireTime, "/api/auth/refresh");

    return AuthMapper.toLoginResponse(accessToken, currentUser);
  }

  @Override
  public void register(SignUpRequest signUpRequest) {
    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      throw new RuntimeException("User already exists!");
    }

    User user = new User();
    user.setEmail(signUpRequest.getEmail());
    user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
    user.setFullName(signUpRequest.getFullName());
    user.setEnabled(false);
    this.userRepository.save(user);
    String otpCode = Gen.genCode(6);
    this.redisService.saveKeyAndValue("lms:auth:otp-active:code:username:" + user.getEmail(), otpCode , 5 , TimeUnit.MINUTES);
    this.redisService.saveKeyAndValue("lms:auth:otp-active:attempt:username:" + user.getEmail(), 5 , 5 , TimeUnit.MINUTES);
    this.eventPublisher.publishEvent(new AuthEvent(AuthEventType.REGISTER, user.getEmail() , otpCode));
  }

  @Override
  public void verifyAccount(VerifyAccountRequest request) {
    User user = this.userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));
    String otp = this.redisService.getValue("lms:auth:otp-active:code:username:" + user.getEmail(), new TypeReference<String>() {});
    if (otp == null || otp.isEmpty()) {
      throw new BadRequestException("Tài khoản đã được xác thực hoặc mã xác thực đã hết hạn");
    }

    long attempt = this.redisService.getValue("lms:auth:otp-active:attempt:username:" + user.getEmail(), new TypeReference<Long>() {});
    if (attempt <= 0) {
      throw new BadRequestException("Bạn đã nhập sai mã xác thực 5 lần vui lòng liên hệ với quản trị viên để kích hoạt tài khoản");
    }

    if (!otp.equals(request.getCode())) {
      attempt--;
      this.redisService.saveKeyAndValue("lms:auth:otp-active:attempt:username:" + user.getEmail(), attempt , 5 , TimeUnit.MINUTES);
      throw new BadRequestException(String.format("Xác thực thật bại, bạn còn %d lần để thử", attempt));
    }

    user.setEnabled(true);
    this.userRepository.save(user);
    this.eventPublisher.publishEvent(new AuthEvent(AuthEventType.VERIFY_ACCOUNT, user.getEmail() ,null));
  }

  @Override
  public void forgotPassword(ForgotPasswordRequest request) {
    User user = this.userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));
    if (user.getRole().equals(Role.ADMIN)) {
      throw new BadRequestException("Không có quyền đổi mật khẩu tài khoản này");
    }

    String otpCode = Gen.genCode(8);
    this.redisService.saveKeyAndValue("lms:auth:otp-forgot-password:code:username:" + user.getEmail(), otpCode , 3 , TimeUnit.MINUTES);
    this.redisService.saveKeyAndValue("lms:auth:otp-forgot-password:attempt:username:" + user.getEmail(), 3 , 3 , TimeUnit.MINUTES);
    this.eventPublisher.publishEvent(new AuthEvent(AuthEventType.FORGOT_PASSWORD, user.getEmail() , otpCode));
  }

  @Override
  public void resetPassword(ResetPasswordRequest request) {
    User user = this.userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));
    String otp = this.redisService.getValue("lms:auth:otp-forgot-password:code:username:" + user.getEmail(), new TypeReference<String>() {});
    if (otp == null || otp.isEmpty()) {
      throw new BadRequestException("Tài khoản đã được xác thực hoặc mã xác thực đã hết hạn");
    }

    long attempt = this.redisService.getValue("lms:auth:otp-forgot-password:attempt:username:" + user.getEmail(), new TypeReference<Long>() {});
    if (attempt <= 0) {
      throw new BadRequestException("Bạn đã nhập sai mã xác thực 3 lần vui lòng liên hệ với quản trị viên để kích hoạt tài khoản");
    }

    if (!otp.equals(request.getCode())) {
      attempt--;
      this.redisService.saveKeyAndValue("lms:auth:otp-forgot-password:attempt:username:" + user.getEmail(), attempt , 3 , TimeUnit.MINUTES);
      throw new BadRequestException(String.format("Xác thực thật bại, bạn còn %d lần để thử", attempt));
    }

    String newPassword = Gen.genPasswordRaw(16);
    user.setPassword(this.passwordEncoder.encode(newPassword));
    this.userRepository.save(user);
    this.eventPublisher.publishEvent(new AuthEvent(AuthEventType.RESET_PASSWORD, user.getEmail() , newPassword));
  }

  @Override
  public RefreshResponse refresh(HttpServletRequest request) {
    String token = this.cookieUtils.getCookieValue(request, "refreshToken");
    if (token == null || !this.jwtUtils.validateJwtToken(token)) {
      throw new BadRequestException("Token không hợp lệ!");
    }
    String email = this.jwtUtils.extractUsername(token);
    User user = this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    String newToken = this.jwtUtils.generateAccessToken(user);
    this.redisService.saveKeyAndValue("lms:auth:access-token:username:" + user.getEmail(), newToken , accessTokenExpireTime , TimeUnit.SECONDS);
    return RefreshResponse.builder().accessToken(newToken).build();
  }

  @Override
  public void logout(HttpServletResponse response) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));

//    ResponseCookie cookie =  ResponseCookie.from("refreshToken" , null)
//        .maxAge(0)
//        .secure(false)
//        .httpOnly(true)
//        .path("/api/auth")
//        .sameSite("Lax")
//        .build();
//    response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    this.cookieUtils.setCookieValue(response, "refreshToken", null, 0, "/api/auth/refresh");

    this.eventPublisher.publishEvent(new AuthEvent(AuthEventType.LOGOUT , currentUser.getEmail() , String.valueOf(accessTokenExpireTime)));
  }

  @Override
  public void changePassword(ChangePasswordRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));
    if (!this.passwordEncoder.matches(request.getOldPassword(), currentUser.getPassword())) {
      throw new BadRequestException("Mật khẩu cũ không chính xác");
    }
    currentUser.setPassword(this.passwordEncoder.encode(request.getNewPassword()));
    this.userRepository.save(currentUser);
  }
}
