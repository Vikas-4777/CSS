package com.courseselection.repository;

import com.courseselection.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByStudentId(Long studentId);
    boolean existsByStudentIdAndDayAndTimeSlot(Long studentId, String day, String timeSlot);
    void deleteByStudentIdAndCourseId(Long studentId, Long courseId);
}
