package com.hust.lms.streaming.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
    basePackages = "com.hust.lms.streaming.repository.jpa"
)
@EnableElasticsearchRepositories(
    basePackages = "com.hust.lms.streaming.repository.elasticsearch"
)
public class RepositoryConfiguration {

}
