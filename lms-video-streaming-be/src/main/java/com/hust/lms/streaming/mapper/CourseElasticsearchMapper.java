package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.elasticsearch.CourseDocumentDto;

public class CourseElasticsearchMapper {

    private CourseElasticsearchMapper(){
      throw new AssertionError("Utility class");
    }

    public static CourseDocumentDto creatingCourseDocument(Course course){
      if (course == null) return null;
      return CourseDocumentDto.builder()
          .id(String.valueOf(course.getId()))
          .title(course.getTitle())
          .slug(course.getSlug())
          .descriptionShort(course.getDescriptionShort())
          .price(course.getPrice().doubleValue())
          .salePrice(course.getSalePrice().doubleValue())
          .averageRating(course.getAverageRating())
          .thumbnail(course.getThumbnail())
          .categorySlug(course.getCategory().getSlug())
          .instructorName(course.getInstructor().getUser().getFullName())
          .countLesson(course.getSections().stream().map(section -> section.getLessons().size()).reduce(0,Integer::sum))
          .build();
    }

    public static CourseDocumentDto updatingInfoCourseDocument(Course course){
      if (course == null) return null;

      return CourseDocumentDto.builder()
          .title(course.getTitle())
          .descriptionShort(course.getDescriptionShort())
          .price(course.getPrice().doubleValue())
          .salePrice(course.getSalePrice().doubleValue())
          .thumbnail(course.getThumbnail())
          .averageRating(course.getAverageRating())
          .build();
    }

    public static Integer getCountLesson(Course course){
      if (course == null) return 0;
      return course.getSections().stream().mapToInt(section -> section.getLessons().size()).reduce(0,Integer::sum);
    }
}
