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
        List<com.courseselection.entity.Section> sections = enrollments.stream().map(Enrollment::getSection)
                .collect(Collectors.toList());
        return generateTimetableForSections(sections);
    }

    public List<TimetableDTO> getTeacherTimetable(Long teacherId) {
        List<Course> courses = courseRepository.findByTeacherId(teacherId);
        List<com.courseselection.entity.Section> sections = courses.stream().flatMap(c -> c.getSections().stream()).collect(Collectors.toList());
        return generateTimetableForSections(sections);
    }

    private List<TimetableDTO> generateTimetableForSections(List<com.courseselection.entity.Section> sections) {
        List<TimetableDTO> timetable = new ArrayList<>();
        int n = sections.size();
        if (n == 0)
            return timetable;

        for (com.courseselection.entity.Section section : sections) {
            Course course = section.getCourse();
            char block = (char) ('A' + (section.getId() % 5));
            String room = block + String.format("%03d", (section.getId() * 101) % 400 + 101);
            int basePattern = (int) (section.getId() % CLASS_PERIODS.length);

            for (int d = 0; d < 6; d++) {
                int p_idx = (basePattern + d) % CLASS_PERIODS.length;

                TimetableDTO dto = new TimetableDTO();
                dto.setId(section.getId() * 1000 + d);
                dto.setCourseId(course.getId());
                dto.setCourseName(course.getName() + " [" + section.getSectionName() + "]");
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
