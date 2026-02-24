package com.courseselection.controller;

import com.courseselection.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;
    
    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }
    
    @PostMapping
    public ResponseEntity<?> enrollStudent(@RequestBody Map<String, Long> request) {
        try {
            return ResponseEntity.ok(enrollmentService.enrollStudent(
                request.get("studentId"), request.get("sectionId")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping
    public ResponseEntity<?> dropCourse(@RequestParam Long studentId, @RequestParam Long courseId) {
        try {
            enrollmentService.dropCourse(studentId, courseId);
            return ResponseEntity.ok(Map.of("message", "Course dropped"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentEnrollments(@PathVariable Long studentId) {
        return ResponseEntity.ok(enrollmentService.getStudentEnrollments(studentId));
    }
    
    @GetMapping("/section/{sectionId}")
    public ResponseEntity<?> getSectionEnrollments(@PathVariable Long sectionId) {
        return ResponseEntity.ok(enrollmentService.getSectionEnrollments(sectionId));
    }
}
