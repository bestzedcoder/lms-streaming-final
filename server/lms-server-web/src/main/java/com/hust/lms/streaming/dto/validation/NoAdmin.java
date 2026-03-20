package com.hust.lms.streaming.dto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = RoleNotAllowedValidator.class)
public @interface NoAdmin {
  String message() default "Không được chọn vai trò này";
  Class<?>[] groups() default {};
  Class<? extends Payload>[] payload() default {};
}