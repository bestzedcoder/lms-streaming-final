package com.hust.lms.streaming.dto.response.user;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserPublicResponse {
  private UUID id;
  private String fullName;
  private String email;
  private String avatarUrl;
}
