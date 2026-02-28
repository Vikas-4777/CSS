package com.courseselection.service;

import com.courseselection.dto.TimetableDTO;
import com.courseselection.entity.Course;
import com.courseselection.entity.Enrollment;
import com.courseselection.repository.CourseRepository;
import com.courseselection.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimetableService {
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    private static final String[] DAYS = { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" };
    private static final int[] CLASS_PERIODS = { 1, 2, 4, 5, 7, 8, 9, 11 };

    public TimetableService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    public List<TimetableDTO> getStudentTimetable(Long studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        List<Course> courses = enrollments.stream().map(e -> e.getSection().getCourse()).distinct()
                .collect(Collectors.toList());
        return generateTimetableForCourses(courses);
    }

    public List<TimetableDTO> getTeacherTimetable(Long teacherId) {
        List<Course> courses = courseRepository.findByTeacherId(teacherId);
        return generateTimetableForCourses(courses);
    }

    private List<TimetableDTO> generateTimetableForCourses(List<Course> courses) {
        List<TimetableDTO> timetable = new ArrayList<>();
        int n = courses.size();
        if (n == 0)
            return timetable;

        for (Course course : courses) {
            char block = (char) ('A' + (course.getId() % 5));
            String room = block + String.format("%03d", (course.getId() * 101) % 400 + 101);
            int basePattern = (int) (course.getId() % CLASS_PERIODS.length);

            for (int d = 0; d < 6; d++) {
                int p_idx = (basePattern + d) % CLASS_PERIODS.length;

                TimetableDTO dto = new TimetableDTO();
                dto.setId(course.getId() * 1000 + d);
                dto.setCourseId(course.getId());
                dto.setCourseName(course.getName());
                dto.setDay(DAYS[d]);
                dto.setTimeSlot(String.valueOf(CLASS_PERIODS[p_idx]));
                dto.setRoom(room);
                timetable.add(dto);
            }
        }
        return timetable;
    }

    // Kept for backward compatibility if used elsewhere (like EnrollmentService)
    public static String[] getCourseSlot(Long courseId) {
        return new String[] { "Mon", "1", "R101" };
    }
}
