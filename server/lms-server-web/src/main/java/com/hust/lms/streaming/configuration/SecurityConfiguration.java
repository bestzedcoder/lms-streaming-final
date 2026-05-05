package com.hust.lms.streaming.configuration;

import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.middleware.JwtFilter;
import com.hust.lms.streaming.security.CustomAccessDeniedHandler;
import com.hust.lms.streaming.security.CustomAuthenticationEntryPoint;
import com.hust.lms.streaming.security.CustomizeAuthenticationProvider;
import java.util.List;

import com.hust.lms.streaming.security.Oauth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {
  private final JwtFilter jwtFilter;
  private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
  private final CustomAccessDeniedHandler customAccessDeniedHandler;
  private final Oauth2SuccessHandler successHandler;

  @Bean
  public SecurityFilterChain configure(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(AbstractHttpConfigurer::disable)
        .exceptionHandling(exception -> exception
            .authenticationEntryPoint(customAuthenticationEntryPoint) // Xử lý 401
            .accessDeniedHandler(customAccessDeniedHandler)           // Xử lý 403
        )
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(
                "/api/auth/login",
                "/api/auth/register",
                "/api/auth/verify-account",
                "/api/auth/forgot-password",
                "/api/auth/reset-password",
                "/api/auth/refresh",
                "/api/public/**",
                "/overview/**",
                "/api/admin/login").permitAll()
            .requestMatchers("/api/admin/**").hasRole(Role.ADMIN.name())
            .requestMatchers("/api/employee/**").hasRole(Role.EMPLOYEE.name())
            .requestMatchers("/api/instructor/**").hasRole(Role.INSTRUCTOR.name())
            .anyRequest().authenticated()
        )
        .oauth2Login(oauth -> oauth.successHandler(successHandler))
        .addFilterBefore(jwtFilter , UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }


  // Cấu hình CORS
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public AuthenticationManager authenticationManager(UserDetailsService userDetailsService,
      PasswordEncoder passwordEncoder) {
    CustomizeAuthenticationProvider authenticationProvider =
        new CustomizeAuthenticationProvider(passwordEncoder, userDetailsService);
    ProviderManager providerManager = new ProviderManager(authenticationProvider);
    providerManager.setEraseCredentialsAfterAuthentication(false);
    return  providerManager;
  }
}
