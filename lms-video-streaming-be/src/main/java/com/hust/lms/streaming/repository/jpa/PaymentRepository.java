package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Payment;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
  Payment findByOrderCode(String orderCode);
  Optional<Payment> findPaymentByOrderCode(String code);
}
