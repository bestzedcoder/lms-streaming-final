#!/bin/bash

# 1. Khởi động các Docker container đồng thời
echo "🚀 Đang khởi động các Docker containers..."
docker start zed_elastic_secure redis-streaming rabbitmq

# 2. Chờ một chút để các dịch vụ (đặc biệt là Elasticsearch và RabbitMQ) sẵn sàng
# Vì các dịch vụ này cần thời gian để khởi tạo bên trong container
echo "⏳ Đang chờ các dịch vụ ổn định (5 giây)..."
sleep 5

# 3. Khởi động dự án Spring Boot
echo "☕ Đang khởi động Spring Boot project..."

# Sử dụng Maven
./mvnw spring-boot:run

# Hoặc nếu bạn dùng Gradle, hãy bỏ comment dòng dưới và comment dòng Maven:
# ./gradlew bootRun

# Hoặc nếu bạn đã build ra file jar:
# java -jar target/your-app-name.jar