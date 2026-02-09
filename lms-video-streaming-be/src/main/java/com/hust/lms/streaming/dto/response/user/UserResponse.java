package com.hust.lms.streaming.dto.response.user;

import com.hust.lms.streaming.enums.Role;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
  private String uuid;
  private String fullName;
  private String phone;
  private String email;
  private Role role;
  private String avatarUrl;
  private String lockReason;
  private boolean active;
  private boolean locked;
  private boolean updateProfile;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private String updatedBy;
  private String createdBy;
}
