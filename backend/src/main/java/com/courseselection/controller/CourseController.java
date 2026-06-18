package com.courseselection.controller;

import com.courseselection.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            Integer credits = (Integer) request.get("credits");
            Long teacherId = Long.valueOf(request.get("teacherId").toString());
            return ResponseEntity.ok(courseService.createCourse(name, credits, teacherId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(courseService.getCourseById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getCoursesByTeacher(@PathVariable("teacherId") Long teacherId) {
        return ResponseEntity.ok(courseService.getCoursesByTeacher(teacherId));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignCourseTeacher(@PathVariable("id") Long id,
            @RequestBody Map<String, Object> request) {
        try {
            Long newTeacherId = Long.valueOf(request.get("teacherId").toString());
            return ResponseEntity.ok(courseService.assignTeacher(id, newTeacherId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable("id") Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok(Map.of("message", "Course deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveCourse(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(courseService.approveCourse(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
