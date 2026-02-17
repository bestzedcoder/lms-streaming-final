package com.hust.lms.streaming.security;

import com.hust.lms.streaming.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomizeUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    try {
      return userRepository.findByEmail(username)
          .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + username));
    } catch (UsernameNotFoundException e) {
      throw new BadCredentialsException(e.getMessage());
    }
  }
}
