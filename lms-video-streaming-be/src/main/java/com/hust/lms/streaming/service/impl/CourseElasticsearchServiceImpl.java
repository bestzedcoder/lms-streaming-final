package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.common.PageResponse;
import com.hust.lms.streaming.model.elasticsearch.CourseDocument;
import com.hust.lms.streaming.service.CourseElasticsearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseElasticsearchServiceImpl implements CourseElasticsearchService {

  private final ElasticsearchOperations elasticsearchOperations;

  @Override
  public PageResponse<CourseDocument> searchPublicCourses(String keyword, String category, Pageable pageable) {

    NativeQuery query = NativeQuery.builder()
        .withQuery(q -> q.bool(b -> {
          // Search theo keyword (Must)
          if (StringUtils.hasText(keyword)) {
            b.must(m -> m.multiMatch(mm -> mm
                .fields("title^3", "instructorName")
                .query(keyword)
                .fuzziness("AUTO")
            ));
          }

          if (StringUtils.hasText(category)) {
            b.filter(f -> f.term(t -> t
                .field("categorySlug")
                .value(category)
            ));
          }
          return b;
        }))
        .withPageable(pageable)
        .build();

    SearchHits<CourseDocument> searchHits = elasticsearchOperations.search(query, CourseDocument.class);

    List<CourseDocument> courses = searchHits.getSearchHits().stream()
        .map(SearchHit::getContent)
        .collect(Collectors.toList());

    return PageResponse.<CourseDocument>builder()
        .result(courses)
        .currentPages(pageable.getPageNumber() + 1)
        .pageSizes(pageable.getPageSize())
        .totalElements(searchHits.getTotalHits())
        .totalPages((int) Math.ceil((double) searchHits.getTotalHits() / pageable.getPageSize()))
        .build();
  }
}