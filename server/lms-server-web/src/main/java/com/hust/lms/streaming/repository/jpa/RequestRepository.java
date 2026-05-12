package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.enums.RequestType;
import com.hust.lms.streaming.model.Request;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RequestRepository extends JpaRepository<Request, UUID> {
  Optional<Request> findByIdAndRequestType(UUID requestId, RequestType type);

  @Query(value = """
    SELECT COUNT(*)
    FROM requests r
    WHERE r.status = false AND r.request_type = :type
""", nativeQuery = true)
  int countPendingRequests(String type);


  @Query(value = """
    SELECT r.*
    FROM requests r
    WHERE r.status = false AND r.request_type = :type 
""", nativeQuery = true)
  List<Request> getPendingRequests(String type);

  @Query(value = """
    SELECT r.*
    FROM requests r 
    WHERE r.user_id = :userId 
""", nativeQuery = true)
  List<Request> findRequestsByStudent(UUID userId);

  @Query(value = """
    SELECT EXISTS (
        SELECT 1
        FROM requests r INNER JOIN courses c ON r.target_id = c.id
        WHERE r.request_type = :type AND r.user_id = :userId AND c.slug = :slug
    )
""", nativeQuery = true)
  boolean existsByUserAndCourseSlug(UUID userId, String type, String slug);


  @Query(value = """
    SELECT EXISTS (
        SELECT 1
        FROM requests r 
        WHERE r.request_type = :type AND r.user_id = :userId
    )
""", nativeQuery = true)
  boolean existsByUser(UUID userId, String type);

}
