package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.common.Gen;
import com.hust.lms.streaming.dto.request.auth.ForgotPasswordRequest;
import com.hust.lms.streaming.dto.request.auth.RefreshRequest;
import com.hust.lms.streaming.dto.request.auth.ResetPasswordRequest;
import com.hust.lms.streaming.dto.request.auth.SignUpRequest;
import com.hust.lms.streaming.dto.request.auth.VerifyAccountRequest;
import com.hust.lms.streaming.dto.response.auth.LoginResponse;
import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.event.custom.AuthEvent;
import com.hust.lms.streaming.event.enums.AuthEventType;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.exception.ResourceNotFoundException;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.UserRepository;
import com.hust.lms.streaming.security.JwtUtils;
import com.hust.lms.streaming.service.AuthService;
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

  @Value("${app.security.jwt.accessExpiration}")
  private long accessTokenExpireTime;
  @Value("${app.security.jwt.refreshExpiration}")
  private long refreshTokenExpireTime;

  @Override
  public LoginResponse login(String email, String password) {

    Authentication authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
    Authentication authentication = authenticationManager.authenticate(authenticationToken);

    SecurityContextHolder.getContext().setAuthentication(authentication);

    User user = (User) authentication.getPrincipal();

    String accessToken = jwtUtils.generateAccessToken(user);
    String refreshToken = jwtUtils.generateRefreshToken(user);
    this.redisService.saveKeyAndValue("lms:auth:access-token:username:" + user.getEmail(), accessToken , accessTokenExpireTime , TimeUnit.SECONDS);
    this.redisService.saveKeyAndValue("lms:auth:refresh-token:username:" + user.getEmail(), refreshToken , refreshTokenExpireTime , TimeUnit.SECONDS);

    return LoginResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .build();
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
      throw new BadRequestException(String.format("Xác thực thật bại, bạn còn %d để thử", attempt));
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
      throw new BadRequestException(String.format("Xác thực thật bại, bạn còn %d để thử", attempt));
    }

    String newPassword = Gen.genPasswordRaw(16);
    user.setPassword(this.passwordEncoder.encode(newPassword));
    this.userRepository.save(user);
    this.eventPublisher.publishEvent(new AuthEvent(AuthEventType.RESET_PASSWORD, user.getEmail() , newPassword));
  }

  @Override
  public String refresh(RefreshRequest request) {
    return "";
  }

  @Override
  public void logout() {

  }
}
