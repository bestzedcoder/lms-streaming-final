package com.hust.lms.streaming.security;


import com.hust.lms.streaming.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomizeAuthenticationProvider implements AuthenticationProvider {
  private final PasswordEncoder passwordEncoder;
  private final UserDetailsService userDetailsService;
  @Override
  public Authentication authenticate(Authentication authentication)  {
    String username = authentication.getName();
    String rawPassword = authentication.getCredentials().toString();

    User currentUser = (User) this.userDetailsService.loadUserByUsername(username);

    if (!passwordEncoder.matches(rawPassword, currentUser.getPassword())) {
      throw new BadCredentialsException("Mật khẩu không chính xác!");
    }

    if (!currentUser.isEnabled()) {
      throw new DisabledException("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email!");
    }

    if (!currentUser.isAccountNonLocked()) {
      String reason = currentUser.getLockReason();
      throw new LockedException("Tài khoản đã bị khóa do vi phạm chính sách:\n" + reason);
    }

    return new UsernamePasswordAuthenticationToken(
        currentUser.getId(),
        null,
        currentUser.getAuthorities()
    );
  }

  @Override
  public boolean supports(Class<?> authentication) {
    return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
  }
}
