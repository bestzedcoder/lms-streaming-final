package com.hust.lms.streaming.model;


import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.model.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Collection;
import java.util.Collections;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@SuperBuilder
@Table(name = "_user")
public class User extends BaseEntity implements UserDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "_id")
  private UUID id;

  @Column(name = "_email" , nullable = false , unique = true)
  private String email;

  @Column(name = "_password" , nullable = false)
  private String password;

  @Column(name = "_full_name" , nullable = false)
  private String fullName;

  @Column(name = "_phone" , unique = true)
  private String phone;

  @Column(name = "_facebook_url")
  private String facebookUrl;

  @Column(name = "_avatar_url")
  private String avatarUrl;

  @Column(name = "_public_id")
  private String publicId;

  @Column(name = "_active" , nullable = false)
  private boolean enabled;

  @Column(name = "_locked" , nullable = false)
  @Builder.Default
  private boolean locked = false;

  @Column(name = "_update_profile" , nullable = false)
  @Builder.Default
  private boolean updateProfile = false;

  @Column(name = "_lock_reason", columnDefinition = "TEXT")
  private String lockReason;

  @Enumerated(EnumType.STRING)
  @Column(name = "_role" , nullable = false)
  @Builder.Default
  private Role role = Role.STUDENT;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return  Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
  }

  @Override
  public String getPassword() {
    return this.password;
  }

  @Override
  public String getUsername() {
    return this.email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return !this.locked;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return this.enabled;
  }
}
