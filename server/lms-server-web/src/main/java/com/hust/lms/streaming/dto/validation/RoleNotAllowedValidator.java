package com.hust.lms.streaming.dto.validation;

import com.hust.lms.streaming.enums.Role;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class RoleNotAllowedValidator implements ConstraintValidator<NoAdmin, Role> {
  @Override
  public boolean isValid(Role value, ConstraintValidatorContext context) {
    return !value.equals(Role.ADMIN);
  }
}
