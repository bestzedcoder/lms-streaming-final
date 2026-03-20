package com.hust.lms.streaming.model.elasticsearch;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.InnerField;
import org.springframework.data.elasticsearch.annotations.MultiField;

@Document(indexName = "courses")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDocument {
  @Id
  private String id;

  // MultiField: Vừa tìm kiếm text (analyzer), vừa sort/filter chính xác (keyword)
  @MultiField(mainField = @Field(type = FieldType.Text, analyzer = "standard"),
      otherFields = {
          @InnerField(suffix = "keyword", type = FieldType.Keyword)
      })
  private String title;

  @Field(type = FieldType.Text)
  private String slug;

  @Field(type = FieldType.Text)
  private String descriptionShort;

  @Field(type = FieldType.Keyword, index = false)
  private String thumbnail;

  @MultiField(mainField = @Field(type = FieldType.Text, analyzer = "standard"),
      otherFields = {
          @InnerField(suffix = "keyword", type = FieldType.Keyword)
      })
  private String nickname;

  @Field(type = FieldType.Keyword)
  private String categorySlug;

  @Field(type = FieldType.Double)
  private Double averageRating;

  @Field(type = FieldType.Integer)
  private Integer totalLessons;
}