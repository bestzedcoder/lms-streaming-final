package com.hust.lms.streaming.security;

import com.hust.lms.streaming.model.User;
import org.springframework.data.domain.AuditorAware;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
public class AuditorAwareImpl implements AuditorAware<String> {

  @Override
  @NonNull
  public Optional<String> getCurrentAuditor() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null ) {
      return Optional.of("system");
    }

    Object principal = authentication.getPrincipal();
    if (principal instanceof User user) {
      return Optional.of(user.getEmail());
    }

    return Optional.empty();
  }
}