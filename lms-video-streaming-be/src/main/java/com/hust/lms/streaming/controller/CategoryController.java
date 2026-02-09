package com.hust.lms.streaming.controller;

import com.hust.lms.streaming.dto.common.BaseListResponse;
import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.request.category.CategoryCreatingRequest;
import com.hust.lms.streaming.dto.request.category.CategoryUpdatingRequest;
import com.hust.lms.streaming.dto.response.category.CategoryResponse;
import com.hust.lms.streaming.service.CategoryService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("admin/categories")
@RequiredArgsConstructor
public class CategoryController {
  private final CategoryService categoryService;

  @GetMapping
  public ResponseEntity<BaseListResponse<?>> findAll() {
    List<CategoryResponse> categories = this.categoryService.findAll();
    return ResponseEntity.ok(BaseListResponse.<CategoryResponse>builder()
            .code(200)
            .data(categories)
            .message("Thông tin chi tiết các danh mục!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }


  @PutMapping("{uuid}")
  public ResponseEntity<BaseResponse<?>> update(@PathVariable("uuid") UUID id ,@RequestBody @Valid CategoryUpdatingRequest req) {
    this.categoryService.update(id ,req);
    return ResponseEntity.ok(BaseResponse.builder()
            .code(200)
            .message("Cập nhật danh mục thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @PostMapping
  public ResponseEntity<BaseResponse<?>> create(@RequestBody @Valid CategoryCreatingRequest req) {
    this.categoryService.create(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponse.builder()
            .code(201)
            .message("Tạo danh mục thành công!")
            .success(true)
            .timestamp(LocalDateTime.now())
        .build());
  }

  @DeleteMapping("{uuid}")
  public ResponseEntity<BaseResponse<?>> delete(@PathVariable("uuid") UUID id) {
    this.categoryService.delete(id);
    return ResponseEntity.ok(BaseResponse.builder()
        .code(200)
        .message("Xóa danh mục thành công!")
        .success(true)
        .timestamp(LocalDateTime.now())
        .build());
  }
}
