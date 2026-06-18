package com.courseselection.service;

import com.courseselection.dto.*;
import com.courseselection.entity.*;
import com.courseselection.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class CourseService {
    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final UserRepository userRepository;
    private final TimetableRepository timetableRepository;
    private final WaitlistRepository waitlistRepository;

    public CourseService(CourseRepository courseRepository, SectionRepository sectionRepository,
            UserRepository userRepository, TimetableRepository timetableRepository,
            WaitlistRepository waitlistRepository) {
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
        this.userRepository = userRepository;
        this.timetableRepository = timetableRepository;
        this.waitlistRepository = waitlistRepository;
    }

    @Transactional
    public CourseDTO createCourse(String name, Integer credits, Long teacherId) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Course course = new Course();
        course.setName(name);
        course.setCredits(credits);
        course.setTeacher(teacher);
        course.setStatus("PENDING");
        course = courseRepository.save(course);

        // Create 4 sections (A, B, C, D)
        for (String sectionName : Arrays.asList("A", "B", "C", "D")) {
            Section section = new Section();
            section.setCourse(course);
            section.setSectionName(sectionName);
            section.setCapacity(50);
            section.setEnrolled(0);
            sectionRepository.save(section);
        }

        return convertToDTO(courseRepository.findById(course.getId()).get());
    }

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long id) {
        return courseRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    @Transactional
    public CourseDTO assignTeacher(Long courseId, Long newTeacherId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User teacher = userRepository.findById(newTeacherId)
                .orElseThrow(() -> new RuntimeException("New teacher not found"));

        course.setTeacher(teacher);
        course = courseRepository.save(course);
        return convertToDTO(course);
    }

    @Transactional
    public CourseDTO approveCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setStatus("APPROVED");
        return convertToDTO(courseRepository.save(course));
    }

    public List<CourseDTO> getCoursesByTeacher(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCourse(Long id) {
        timetableRepository.deleteByCourseId(id);
        waitlistRepository.deleteBySectionCourseId(id);
        courseRepository.deleteById(id);
    }

    private CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setName(course.getName());
        dto.setCredits(course.getCredits());
        if (course.getTeacher() != null) {
            dto.setTeacherId(course.getTeacher().getId());
            dto.setTeacherName(course.getTeacher().getName());
        }
        dto.setStatus(course.getStatus());

        List<SectionDTO> sections = sectionRepository.findByCourseId(course.getId()).stream()
                .map(this::convertSectionToDTO)
                .collect(Collectors.toList());
        dto.setSections(sections);

        return dto;
    }

    private SectionDTO convertSectionToDTO(Section section) {
        SectionDTO dto = new SectionDTO();
        dto.setId(section.getId());
        dto.setCourseId(section.getCourse().getId());
        dto.setCourseName(section.getCourse().getName());
        dto.setSectionName(section.getSectionName());
        dto.setCapacity(section.getCapacity());
        dto.setEnrolled(section.getEnrolled());
        dto.setAvailable(section.getEnrolled() < section.getCapacity());
        return dto;
    }
}
