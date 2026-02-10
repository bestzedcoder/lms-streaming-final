package com.hust.lms.streaming.dto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = NoHtmlValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface NoHtml {
  String message() default "Trường này không được chứa ký tự HTML hoặc mã độc";
  Class<?>[] groups() default {};
  Class<? extends Payload>[] payload() default {};
}