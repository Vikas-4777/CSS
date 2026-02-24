package com.courseselection.repository;

import com.courseselection.entity.Waitlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WaitlistRepository extends JpaRepository<Waitlist, Long> {
    List<Waitlist> findBySectionIdOrderByAddedAtAsc(Long sectionId);
    boolean existsByStudentIdAndSectionId(Long studentId, Long sectionId);
}
