package com.hust.lms.streaming.event.listener;

import com.hust.lms.streaming.event.custom.CourseEvent;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.service.CourseElasticsearchService;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@RequiredArgsConstructor
public class CourseEventListener {
  private final RedisService redisService;
  private final CourseElasticsearchService courseElasticsearchService;

  @Async
  @EventListener
  public void handle(CourseEvent event) {
    log.info("Auth Event received: type={}, id={}", event.getType(), event.getCourseId());


    switch (event.getType()) {
      case CREATED:
        break;
      case INFO_UPDATED:
        if (this.courseElasticsearchService.existsCourse(event.getCourseId())) {
          Map<String, Object> data = new HashMap<>();
          data.put("title", event.getCourseDocument().getTitle());
          data.put("descriptionShort", event.getCourseDocument().getDescriptionShort());
          data.put("price", event.getCourseDocument().getPrice());
          data.put("salePrice", event.getCourseDocument().getSalePrice());
          data.put("thumbnail", event.getCourseDocument().getThumbnail());
          data.put("averageRating", event.getCourseDocument().getAverageRating());
          this.courseElasticsearchService.updateCourse(event.getCourseId().toString(), data);
        }
        break;
      case CONTENT_UPDATED:
        if (this.courseElasticsearchService.existsCourse(event.getCourseId())) {
          Map<String, Object> data = Map.of("countLesson",event.getData());
          this.courseElasticsearchService.updateCourse(event.getCourseId().toString(), data);
        }
        break;
      case APPROVED_COURSE:
        break;
      case PUBLISHED:
        this.courseElasticsearchService.saveCourse(event.getCourseDocument());
        break;
//      case LOCKED:
//        this.courseElasticsearchService.deleteCourse(event.getCourseId());
//        break;
      case UNLOCKED:
        break;
      case DELETED, MADE_PRIVATE, LOCKED:
        if (this.courseElasticsearchService.existsCourse(event.getCourseId())) {
          this.courseElasticsearchService.deleteCourse(event.getCourseId());
        }
        break;
    }

    this.redisService.deleteKey("lms:instructor:list:course:" + event.getInstructorId());
  }

}
