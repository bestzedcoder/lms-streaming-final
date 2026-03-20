package com.hust.lms.streaming.dto.response.user;

import com.hust.lms.streaming.enums.Role;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
  private UUID id;
  private String fullName;
  private String phone;
  private String email;
  private Role role;
  private String avatarUrl;
  private boolean updateProfile;
}
