package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Video;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VideoRepository extends JpaRepository<Video, UUID> {

  @Query(value = """
    SELECT v.*
    FROM videos v 
    WHERE v.id = :videoId AND v.owner_id = :ownerId
""",nativeQuery = true)
  Optional<Video> findByOwner(UUID ownerId, UUID videoId);

  @Query(value = """
    SELECT v.*
    FROM videos v
    WHERE v.owner_id = :ownerId
""",nativeQuery = true)
  List<Video> findAllByOwner(UUID ownerId);


  @Query(value = """
    SELECT v.*
    FROM videos v 
    WHERE v.status = :status
""",nativeQuery = true)
  List<Video> findByPreview(String status);
}
