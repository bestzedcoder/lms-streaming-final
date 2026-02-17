package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
  Optional<User> findByEmail(String email);
  boolean existsByEmail(String email);
  Page<User> findByEmailContainingIgnoreCase(String email, Pageable pageable);
}
