package com.hust.lms.streaming.dto.response.admin;

import java.math.BigDecimal;

public interface MonthlyRevenueDto {
  Integer getYear();
  Integer getMonth();
  BigDecimal getRevenue();
}
