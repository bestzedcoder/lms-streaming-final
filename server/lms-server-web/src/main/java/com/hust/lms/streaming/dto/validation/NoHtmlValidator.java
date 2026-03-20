package com.hust.lms.streaming.dto.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

public class NoHtmlValidator implements ConstraintValidator<NoHtml, String> {

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if (value == null) return true;

    // Jsoup.isValid trả về true nếu chuỗi AN TOÀN tuyệt đối (không có thẻ HTML nào)
    // Safelist.none() nghĩa là: Không cho phép bất kỳ thẻ nào.
    return Jsoup.isValid(value, Safelist.none());
  }
}