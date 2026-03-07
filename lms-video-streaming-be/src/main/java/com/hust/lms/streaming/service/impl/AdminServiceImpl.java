package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.common.CookieUtils;
import com.hust.lms.streaming.dto.common.PageResponse;
import com.hust.lms.streaming.dto.request.auth.LoginRequest;
import com.hust.lms.streaming.dto.response.admin.CourseOfInstructorResponse;
import com.hust.lms.streaming.dto.response.admin.CoursePendingResponse;
import com.hust.lms.streaming.dto.response.admin.InstructorResponse;
import com.hust.lms.streaming.dto.response.admin.MonthlyRevenueDto;
import com.hust.lms.streaming.dto.response.admin.MonthlyRevenueResponse;
import com.hust.lms.streaming.dto.response.admin.SummaryDashboardResponse;
import com.hust.lms.streaming.dto.response.auth.AdminResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.enums.OrderStatus;
import com.hust.lms.streaming.enums.Role;
import com.hust.lms.streaming.event.custom.AuthEvent;
import com.hust.lms.streaming.event.custom.CourseEvent;
import com.hust.lms.streaming.event.enums.AuthEventType;
import com.hust.lms.streaming.event.enums.CourseEventType;
import com.hust.lms.streaming.exception.AdminException;
import com.hust.lms.streaming.mapper.AdminMapper;
import com.hust.lms.streaming.mapper.AuthMapper;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.Order;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.repository.jpa.InstructorRepository;
import com.hust.lms.streaming.repository.jpa.OrderRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.security.JwtUtils;
import com.hust.lms.streaming.service.AdminService;
import jakarta.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
  private final OrderRepository orderRepository;
  private final InstructorRepository instructorRepository;
  private final JwtUtils jwtUtils;
  private final RedisService redisService;

  @Value("${app.security.jwt.accessAdminExpiration}")
  private long accessTokenAdminExpire;


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
  public AdminResponse login(LoginRequest data, HttpServletResponse response) {
    Authentication authenticationToken = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getPassword());
    Authentication authentication = authenticationManager.authenticate(authenticationToken);

    SecurityContextHolder.getContext().setAuthentication(authentication);

    String authId =  authentication.getPrincipal().toString();

    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));

    if (!currentUser.getRole().equals(Role.ADMIN)) {
      throw new AdminException("Trang này chỉ có tài khoản admin mới có thể truy cập");
    }

    String accessToken = jwtUtils.generateAccessAdminToken(currentUser);

    this.redisService.deleteKey("lms:auth:blacklist:" + currentUser.getUsername());

    CookieUtils.setCookieValue(response, "accessToken", accessToken, this.accessTokenAdminExpire, "/api/admin");
    return AuthMapper.toAdminResponse(currentUser);
  }

  @Override
  public void logout(HttpServletResponse response) {
    String adminId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    User currentUser = this.userRepository.getReferenceById(UUID.fromString(adminId));

    CookieUtils.setCookieValue(response, "accessToken", null, 0, "/api/admin");

    this.eventPublisher.publishEvent(new AuthEvent(AuthEventType.LOGOUT , currentUser.getEmail() , String.valueOf(this.accessTokenAdminExpire)));
  }

  @Override
  public List<CoursePendingResponse> getCoursesPending() {
    List<Course> courses = this.courseRepository.findCoursesByStatus(CourseStatus.PENDING);
    return courses.stream().map(AdminMapper::mapCourseToCoursePendingResponse).toList();
  }

  @Override
  public Integer getCoursesPendingCount() {
    return this.courseRepository.countByStatus(CourseStatus.PENDING);
  }

  @Override
  public PageResponse<InstructorResponse> getAllInstructor(int page, int limit, String email) {
    String cacheKey = String.format("lms:admin:get:instructor:page:%d:limit:%d:email:%s", page, limit, email);
    PageResponse<InstructorResponse> dataCache = this.redisService.getValue(cacheKey , new TypeReference<PageResponse<InstructorResponse>>() {});

    if (dataCache != null) {
      return dataCache;
    }

    Pageable pageable = PageRequest.of(page - 1, limit);
    Page<User> data = this.userRepository.findByRoleAndEmailContainingIgnoreCase(Role.INSTRUCTOR, email, pageable);
    PageResponse<InstructorResponse> res = PageResponse.<InstructorResponse>builder()
        .currentPages(page)
        .pageSizes(limit)
        .totalElements(data.getTotalElements())
        .totalPages(data.getTotalPages())
        .result(data.getContent().stream().map(user -> {
          Instructor instructor = this.instructorRepository.findById(user.getId()).orElse(null);
          if (instructor == null) return null;
          return AdminMapper.mapUserToInstructorResponse(user, instructor.getCourses().size(), instructor.getTotalStudent());
        }).toList())
        .build();
    this.redisService.saveKeyAndValue(cacheKey, res, 1, TimeUnit.MINUTES);
    return res;
  }

  @Override
  public void lockCourse(UUID courseId) {
    Course course = this.courseRepository.findById(courseId).orElse(null);
    if (course == null) return;
    course.setStatus(CourseStatus.LOCKED);
    this.courseRepository.save(course);
    this.eventPublisher.publishEvent(new CourseEvent(CourseEventType.LOCKED, course.getInstructor().getId(), courseId, null, null ));
  }

  @Override
  public void unlockCourse(UUID courseId) {
    Course course = this.courseRepository.findById(courseId).orElse(null);
    if (course == null) return;
    course.setStatus(CourseStatus.PRIVATE);
    this.courseRepository.save(course);
    this.eventPublisher.publishEvent(new CourseEvent(CourseEventType.UNLOCKED, course.getInstructor().getId(), courseId, null, null ));
  }

  @Override
  public List<CourseOfInstructorResponse> getCoursesOfInstructor(UUID instructorId) {
    List<Course> data = this.courseRepository.findCoursesByInstructorId(instructorId);
    return data.stream().map(AdminMapper::mapCourseToCourseOfInstructorResponse).toList();
  }

  @Override
  public SummaryDashboardResponse getSummaryDashboard() {
    String cacheKey = "lms:admin:summary:dashboard";
    SummaryDashboardResponse dataCache = this.redisService.getValue(cacheKey, new TypeReference<SummaryDashboardResponse>() {});
    if (dataCache != null) {
      return dataCache;
    }
    long totalStudents = this.userRepository.countByRole(Role.STUDENT);
    long totalTeachers = this.userRepository.countByRole(Role.INSTRUCTOR);
    long totalCourses = this.courseRepository.countByStatus(CourseStatus.PUBLISHED);
    long totalRevenues = this.orderRepository.findOrdersByStatus(OrderStatus.COMPLETED).stream().map(Order::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add).longValue();

    SummaryDashboardResponse res = SummaryDashboardResponse.builder()
        .totalStudents(totalStudents)
        .totalTeachers(totalTeachers)
        .totalCourses(totalCourses)
        .totalRevenues(totalRevenues)
        .build();
    this.redisService.saveKeyAndValue(cacheKey, res, 1, TimeUnit.MINUTES);
    return res;
  }

  @Override
  public List<MonthlyRevenueResponse> getRecent10MonthsRevenue() {
    List<MonthlyRevenueDto> rawData = orderRepository.getLast10MonthsRevenue();

    Map<String, BigDecimal> revenueMap = rawData.stream()
        .collect(Collectors.toMap(
            dto -> dto.getYear() + "-" + dto.getMonth(),
            MonthlyRevenueDto::getRevenue
        ));

    List<MonthlyRevenueResponse> finalResult = new ArrayList<>();
    YearMonth currentMonth = YearMonth.now();

    for (int i = 9; i >= 0; i--) {
      YearMonth targetMonth = currentMonth.minusMonths(i);
      String lookupKey = targetMonth.getYear() + "-" + targetMonth.getMonthValue();
      BigDecimal revenue = revenueMap.getOrDefault(lookupKey, BigDecimal.ZERO);
      String label = "T" + targetMonth.getMonthValue() + "/" + (targetMonth.getYear() % 100);
      finalResult.add(MonthlyRevenueResponse.builder()
              .time(label)
              .revenue(revenue.longValue())
          .build());
    }

    return finalResult;
  }
}
