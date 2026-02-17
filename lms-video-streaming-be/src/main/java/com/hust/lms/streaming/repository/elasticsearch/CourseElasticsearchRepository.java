package com.hust.lms.streaming.repository.elasticsearch;

import com.hust.lms.streaming.model.Course;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseElasticsearchRepository extends ElasticsearchRepository<Course, String> {

}
