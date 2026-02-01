package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.request.auth.SignUpRequest;
import com.hust.lms.streaming.dto.response.auth.LoginResponse;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.UserRepository;
import com.hust.lms.streaming.security.JwtUtils;
import com.hust.lms.streaming.service.AuthService;
import lombok.RequiredArgsConstructor;
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

  @Override
  public LoginResponse login(String email, String password) {

    Authentication authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
    Authentication authentication = authenticationManager.authenticate(authenticationToken);

    SecurityContextHolder.getContext().setAuthentication(authentication);

    User user = (User) authentication.getPrincipal();

    String accessToken = jwtUtils.generateAccessToken(user);
    String refreshToken = jwtUtils.generateRefreshToken(user);

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
  }
}
