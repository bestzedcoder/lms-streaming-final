package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseListResponse;
import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.common.PageResponse;
import com.hust.lms.streaming.dto.response.category.CategoryPublicResponse;
import com.hust.lms.streaming.model.elasticsearch.CourseDocument;
import com.hust.lms.streaming.service.CourseElasticsearchService;
import com.hust.lms.streaming.service.PublicService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("public")
public class PublicController {
  private final PublicService publicService;
  private final CourseElasticsearchService courseElasticsearchService;

  @GetMapping("categories")
  public ResponseEntity<BaseListResponse<?>> listCategories() {
    List<CategoryPublicResponse> listCategories = this.publicService.getCategories();
    return ResponseEntity.ok(BaseListResponse.<CategoryPublicResponse>builder()
            .code(200)
            .message("OK")
            .data(listCategories)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("courses/search")
  public ResponseEntity<BaseResponse<?>> searchPublicCourses(
      @RequestParam(value = "page", defaultValue = "1") int page,
      @RequestParam(value = "limit", defaultValue = "10") int limit,
      @RequestParam(value = "q", required = false) String keyword,
      @RequestParam(value = "category", required = false) String category
  ) {
    Pageable pageable = PageRequest.of(page - 1, limit);
    PageResponse<CourseDocument> res = this.courseElasticsearchService.searchPublicCourses(keyword, category, pageable);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("OK")
            .data(res)
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @GetMapping("courses/{uuid}/details")
  public ResponseEntity<BaseResponse<?>> getPublicCourseDetails(@PathVariable("uuid") String id) {
    return null;
  }
}
