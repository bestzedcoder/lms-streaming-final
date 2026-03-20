package com.hust.lms.streaming.database;

import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Value("${app.admin.account.email}")
  private String adminEmail;
  @Value("${app.admin.account.password}")
  private String adminPassword;
  @Value("${app.admin.phone}")
  private String adminPhone;

  @Override
  public void run(String... args) throws Exception {
    // Khởi tạo tài khoản admin
    this.seedAdminUser();
  }

  private void seedAdminUser() {

    if (this.userRepository.existsByEmail(adminEmail)) {
      return;
    }

    log.info("Khởi tạo ứng dụng lần đầu tiên bắt đầu khởi tạo tài khoản admin");
    User user = new User();
    user.setEmail(adminEmail);
    user.setPassword(this.passwordEncoder.encode(adminPassword));
    user.setPhone(adminPhone);
    user.setFirstName("administrator");
    user.setLastName("system");
    user.setEnabled(true);
    user.setLocked(false);
    user.setRole(Role.ADMIN);
    user.setUpdateProfile(true);
    this.userRepository.save(user);
  }
}
