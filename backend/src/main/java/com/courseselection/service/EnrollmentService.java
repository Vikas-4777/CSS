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
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final SectionRepository sectionRepository;
    private final UserRepository userRepository;
    private final WaitlistRepository waitlistRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, SectionRepository sectionRepository,
            UserRepository userRepository, WaitlistRepository waitlistRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.sectionRepository = sectionRepository;
        this.userRepository = userRepository;
        this.waitlistRepository = waitlistRepository;
    }

    @Transactional
    public Map<String, Object> enrollStudent(Long studentId, Long sectionId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found"));

        // Check if already enrolled in this course
        if (enrollmentRepository.existsByStudentIdAndSectionCourseId(studentId, section.getCourse().getId())) {
            throw new RuntimeException("Already enrolled in this course");
        }

        int newCoursePattern = (int) (section.getId() % 8);
        List<Enrollment> currentEnrollments = enrollmentRepository.findByStudentId(studentId);
        for (Enrollment e : currentEnrollments) {
            int existingPattern = (int) (e.getSection().getId() % 8);
            if (newCoursePattern == existingPattern) {
                throw new RuntimeException("Schedule conflict: Overlaps with enrolled course ["
                        + e.getSection().getCourse().getName() + " - Section " + e.getSection().getSectionName() + "]");
            }
        }

        // Check capacity
        if (section.getEnrolled() >= section.getCapacity()) {
            // Add to waitlist
            if (!waitlistRepository.existsByStudentIdAndSectionId(studentId, sectionId)) {
                Waitlist waitlist = new Waitlist();
                waitlist.setStudent(student);
                waitlist.setSection(section);
                waitlistRepository.save(waitlist);
            }
            return Map.of("success", false, "message", "Section full. Added to waitlist.");
        }

        // Enroll
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setSection(section);
        enrollmentRepository.save(enrollment);

        section.setEnrolled(section.getEnrolled() + 1);
        sectionRepository.save(section);

        return Map.of("success", true, "message", "Enrollment successful");
    }

    @Transactional
    public void dropCourse(Long studentId, Long courseId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        Enrollment enrollment = enrollments.stream()
                .filter(e -> e.getSection().getCourse().getId().equals(courseId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        Section section = enrollment.getSection();
        section.setEnrolled(section.getEnrolled() - 1);
        sectionRepository.save(section);

        enrollmentRepository.delete(enrollment);

        // Process waitlist
        List<Waitlist> waitlist = waitlistRepository.findBySectionIdOrderByAddedAtAsc(section.getId());
        if (!waitlist.isEmpty()) {
            Waitlist first = waitlist.get(0);
            enrollStudent(first.getStudent().getId(), section.getId());
            waitlistRepository.delete(first);
        }
    }

    public List<EnrollmentDTO> getStudentEnrollments(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EnrollmentDTO> getSectionEnrollments(Long sectionId) {
        return enrollmentRepository.findBySectionId(sectionId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EnrollmentDTO> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private EnrollmentDTO convertToDTO(Enrollment enrollment) {
        EnrollmentDTO dto = new EnrollmentDTO();
        dto.setId(enrollment.getId());
        dto.setStudentId(enrollment.getStudent().getId());
        dto.setStudentName(enrollment.getStudent().getName());
        dto.setStudentEmail(enrollment.getStudent().getEmail());
        dto.setSectionId(enrollment.getSection().getId());
        dto.setSectionName(enrollment.getSection().getSectionName());
        dto.setCourseId(enrollment.getSection().getCourse().getId());
        dto.setCourseName(enrollment.getSection().getCourse().getName());
        dto.setEnrolledAt(enrollment.getEnrolledAt().toString());
        return dto;
    }
}
