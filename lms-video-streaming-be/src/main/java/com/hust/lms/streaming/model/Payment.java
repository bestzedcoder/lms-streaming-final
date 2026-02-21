package com.hust.lms.streaming.model;

import com.hust.lms.streaming.enums.PaymentMethod;
import com.hust.lms.streaming.enums.PaymentStatus;
import com.hust.lms.streaming.model.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "payments")
public class Payment extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "_id")
  private UUID id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "_order_id", nullable = false)
  private Order order;

  @Column(name = "_amount", nullable = false)
  private BigDecimal amount;

  @Enumerated(EnumType.STRING)
  @Column(name = "_payment_method", nullable = false)
  private PaymentMethod paymentMethod;

  @Column(name = "_transaction_no")
  private String transactionNo;

  @Enumerated(EnumType.STRING)
  @Column(name = "_status", nullable = false)
  private PaymentStatus status;
}
