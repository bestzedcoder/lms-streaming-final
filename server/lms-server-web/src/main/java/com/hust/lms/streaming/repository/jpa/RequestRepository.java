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
    FROM requests r INNER JOIN users u ON r.user_id = u.id
    WHERE r.status = false AND r.request_type = :type 
""", nativeQuery = true)
  List<Request> getPendingRequests(String type);


  @Query(value = """
    SELECT EXISTS (
        SELECT 1
        FROM requests r
        WHERE r.request_type = :type AND r.user_id = :userId
    )
""", nativeQuery = true)
  boolean existsByUser(UUID userId, String type);
}
