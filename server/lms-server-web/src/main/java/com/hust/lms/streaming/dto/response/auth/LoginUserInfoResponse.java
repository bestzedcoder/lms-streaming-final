package com.hust.lms.streaming.dto.response.auth;

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
public class LoginUserInfoResponse {
  private UUID id;
  private String email;
  private String fullName;
  private String avatarUrl;
  private boolean updateProfile;
  private Role role;
}
