package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.common.CookieUtils;
import com.hust.lms.streaming.dto.request.auth.LoginRequest;
import com.hust.lms.streaming.dto.response.admin.CoursePendingResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.event.custom.AuthEvent;
import com.hust.lms.streaming.event.custom.CourseEvent;
import com.hust.lms.streaming.event.enums.AuthEventType;
import com.hust.lms.streaming.event.enums.CourseEventType;
import com.hust.lms.streaming.mapper.AdminMapper;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.security.JwtUtils;
import com.hust.lms.streaming.service.AdminService;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
  private final CourseRepository courseRepository;
  private final ApplicationEventPublisher eventPublisher;
  private final AuthenticationManager authenticationManager;
  private final UserRepository userRepository;
  private final JwtUtils jwtUtils;
  private final RedisService redisService;

  @Value("${app.security.jwt.accessExpiration}")
  private long accessTokenExpire;



  @Override
  public void approve(UUID courseId) {
    Course course = this.courseRepository.findById(courseId).orElse(null);
    if (course == null || !course.getStatus().equals(CourseStatus.PENDING)) {
      return;
    }

    course.setStatus(CourseStatus.PRIVATE);
    this.courseRepository.save(course);
    this.eventPublisher.publishEvent(new CourseEvent(CourseEventType.APPROVED_COURSE, course.getInstructor().getId(), courseId, null, null));
  }

  @Override
  public void login(LoginRequest data, HttpServletResponse response) {
    Authentication authenticationToken = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getPassword());
    Authentication authentication = authenticationManager.authenticate(authenticationToken);

    SecurityContextHolder.getContext().setAuthentication(authentication);

    String authId =  authentication.getPrincipal().toString();

    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));

    String accessToken = jwtUtils.generateAccessToken(currentUser);

    this.redisService.deleteKey("lms:auth:blacklist:" + currentUser.getUsername());

    CookieUtils.setCookieValue(response, "accessToken", accessToken, this.accessTokenExpire, "/");
  }

  @Override
  public void logout(HttpServletResponse response) {
    String adminId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    User currentUser = this.userRepository.getReferenceById(UUID.fromString(adminId));

    CookieUtils.setCookieValue(response, "accessToken", null, 0, "/");

    this.eventPublisher.publishEvent(new AuthEvent(AuthEventType.LOGOUT , currentUser.getEmail() , String.valueOf(this.accessTokenExpire)));
  }

  @Override
  public List<CoursePendingResponse> getCoursesPending() {
    List<Course> courses = this.courseRepository.findCoursesByStatus(CourseStatus.PENDING);
    return courses.stream().map(AdminMapper::mapCourseToCoursePendingResponse).toList();
  }
}
