package com.courseselection.repository;

import com.courseselection.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findBySectionId(Long sectionId);
    boolean existsByStudentIdAndSectionCourseId(Long studentId, Long courseId);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.section.id = :sectionId")
    Long countBySectionId(Long sectionId);
}
