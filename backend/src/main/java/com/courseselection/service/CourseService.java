package com.courseselection.service;

import com.courseselection.dto.*;
import com.courseselection.entity.*;
import com.courseselection.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final UserRepository userRepository;
    
    public CourseService(CourseRepository courseRepository, SectionRepository sectionRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public CourseDTO createCourse(String name, Integer credits, Long teacherId) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        
        Course course = new Course();
        course.setName(name);
        course.setCredits(credits);
        course.setTeacher(teacher);
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
    
    public List<CourseDTO> getCoursesByTeacher(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
    
    private CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setName(course.getName());
        dto.setCredits(course.getCredits());
        dto.setTeacherId(course.getTeacher().getId());
        dto.setTeacherName(course.getTeacher().getName());
        
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
