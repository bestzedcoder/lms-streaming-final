package com.hust.lms.streaming.database;

import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.model.Category;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.jpa.CategoryRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final CategoryRepository categoryRepository;

  @Value("${app.admin.account.email}")
  private String ADMIN_USERNAME;
  @Value("${app.admin.account.password}")
  private String ADMIN_PASSWORD;
  @Value("${app.admin.phone}")
  private String ADMIN_PHONE;

  @Override
  public void run(String... args) throws Exception {
    // Khởi tạo tài khoản admin
    this.seedAdminUser();
    this.seedCategory();
  }

  private void seedAdminUser() {

    if (this.userRepository.existsByEmail(ADMIN_USERNAME)) {
      return;
    }

    log.info("Khởi tạo ứng dụng lần đầu tiên bắt đầu khởi tạo tài khoản admin");
    User user = new User();
    user.setEmail(ADMIN_USERNAME);
    user.setPassword(this.passwordEncoder.encode(ADMIN_PASSWORD));
    user.setPhone(ADMIN_PHONE);
    user.setFirstName("administrator");
    user.setLastName("system");
    user.setEnabled(true);
    user.setLocked(false);
    user.setRole(Role.ADMIN);
    user.setUpdateProfile(true);
    this.userRepository.save(user);
  }

  private void seedCategory() {
    if (categoryRepository.count() > 0) {
      return;
    }

    List<Category> categories = List.of(
            Category.builder()
                    .name("Lập trình")
                    .slug("lap-trinh")
                    .build(),

            Category.builder()
                    .name("Frontend Development")
                    .slug("frontend-development")
                    .build(),

            Category.builder()
                    .name("Backend Development")
                    .slug("backend-development")
                    .build(),

            Category.builder()
                    .name("Mobile Development")
                    .slug("mobile-development")
                    .build(),

            Category.builder()
                    .name("DevOps")
                    .slug("devops")
                    .build(),

            Category.builder()
                    .name("Trí tuệ nhân tạo")
                    .slug("tri-tue-nhan-tao")
                    .build(),

            Category.builder()
                    .name("Khoa học dữ liệu")
                    .slug("khoa-hoc-du-lieu")
                    .build(),

            Category.builder()
                    .name("An toàn thông tin")
                    .slug("an-toan-thong-tin")
                    .build(),

            Category.builder()
                    .name("Thiết kế UI/UX")
                    .slug("thiet-ke-ui-ux")
                    .build(),

            Category.builder()
                    .name("Điện toán đám mây")
                    .slug("dien-toan-dam-may")
                    .build()
    );

    categoryRepository.saveAll(categories);
  }
}
