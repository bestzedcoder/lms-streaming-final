package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.dto.response.admin.MonthlyRevenueDto;
import com.hust.lms.streaming.enums.OrderStatus;
import com.hust.lms.streaming.model.Order;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
  Optional<Order> findOrderByCodeAndUserId(String code, UUID userId);
  List<Order> findOrdersByStatus(OrderStatus status);
  List<Order> findOrdersByUserId(UUID userId);

  @Query(value = """
        SELECT 
            CAST(EXTRACT(YEAR FROM c._completed_at) AS INTEGER) AS year,
            CAST(EXTRACT(MONTH FROM c._completed_at) AS INTEGER) AS month, 
            SUM(c._total_amount) AS revenue 
        FROM orders c
        WHERE c._completed_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '9 months')
          AND c._status = 'COMPLETED' 
        GROUP BY EXTRACT(YEAR FROM c._completed_at), EXTRACT(MONTH FROM c._completed_at) 
        ORDER BY year ASC, month ASC
        """, nativeQuery = true)
  List<MonthlyRevenueDto> getLast10MonthsRevenue();
}
