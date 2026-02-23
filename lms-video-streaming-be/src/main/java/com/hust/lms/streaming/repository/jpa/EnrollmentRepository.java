package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Enrollment;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {

}
