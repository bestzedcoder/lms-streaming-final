package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.common.PageResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.mapper.CourseElasticsearchMapper;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.elasticsearch.CourseDocument;
import com.hust.lms.streaming.model.elasticsearch.CourseDocumentDto;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.service.CourseElasticsearchService;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.document.Document;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.UpdateQuery;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CourseElasticsearchServiceImpl implements CourseElasticsearchService {

  private final ElasticsearchOperations elasticsearchOperations;
  private final CourseRepository courseRepository;

  @Override
  public PageResponse<CourseDocument> searchPublicCourses(String keyword, String category, Pageable pageable) {

    NativeQuery query = NativeQuery.builder()
        .withQuery(q -> {
          if (!StringUtils.hasText(keyword) && !StringUtils.hasText(category)) {
            return q.matchAll(m -> m);
          }
          return q.bool(b -> {
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
          });
        })
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

  @Override
  public boolean existsCourse(UUID id) {
    return this.elasticsearchOperations.exists(id.toString() , CourseDocument.class);
  }

  @Override
  public void deleteCourse(UUID id) {
    this.elasticsearchOperations.delete(id.toString() , CourseDocument.class);
  }

  @Override
  public void updateCourse(String id, Map<String, Object> data) {
    Document document = Document.create();
    document.putAll(data);

    UpdateQuery updateQuery = UpdateQuery.builder(id)
        .withDocument(document)
        .build();

    elasticsearchOperations.update(updateQuery, IndexCoordinates.of("courses"));
  }

  @Override
  public void saveCourse(CourseDocumentDto req) {
    CourseDocument courseDocument = CourseDocument.builder()
        .id(String.valueOf(req.getId()))
        .title(req.getTitle())
        .slug(req.getSlug())
        .descriptionShort(req.getDescriptionShort())
        .price(req.getPrice())
        .salePrice(req.getSalePrice())
        .averageRating(req.getAverageRating())
        .thumbnail(req.getThumbnail())
        .categorySlug(req.getCategorySlug())
        .instructorName(req.getInstructorName())
        .countLesson(req.getCountLesson())
        .build();
    this.elasticsearchOperations.save(courseDocument);
  }


  @EventListener(ApplicationReadyEvent.class)
  public void initIndicesAfterStartup() {
    log.info("--- Đang kiểm tra Elasticsearch Indices ---");

    IndexOperations indexOps = elasticsearchOperations.indexOps(CourseDocument.class);

    if (!indexOps.exists()) {
      log.info("Index 'courses' chưa tồn tại. Tiến hành khởi tạo...");

      indexOps.create();

      indexOps.putMapping(indexOps.createMapping());

      log.info("Khởi tạo Index 'courses' và Mapping thành công!");
    } else {
      log.info("Index 'courses' đã sẵn sàng.");
    }
  }

  @Override
  public void reset() {
    log.info("--- Bắt đầu Reset Index 'courses' ---");
    IndexOperations indexOps = elasticsearchOperations.indexOps(CourseDocument.class);

    if (indexOps.exists()) {
      indexOps.delete();
      log.info("Đã xóa Index 'courses' cũ.");
    }

    indexOps.create();

    indexOps.putMapping(indexOps.createMapping());
    log.info("Đã tạo lại Index và Mapping mới.");

    List<Course> courses = this.courseRepository.findCoursesByStatus(CourseStatus.PUBLISHED);
    courses.forEach(course -> this.saveCourse(CourseElasticsearchMapper.creatingCourseDocument(course)));
    log.info("Đã nạp lại dữ liệu thành công. Quá trình reset hoàn tất!");
  }
}