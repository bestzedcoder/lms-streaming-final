package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseListResponse;
import com.hust.lms.streaming.dto.response.category.CategoryPublicResponse;
import com.hust.lms.streaming.service.PublicService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("public")
public class PublicController {
  private final PublicService publicService;

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
}
