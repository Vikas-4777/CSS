package com.courseselection.controller;

import com.courseselection.service.TimetableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/timetable")
public class TimetableController {
    private final TimetableService timetableService;
    
    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentTimetable(@PathVariable Long studentId) {
        return ResponseEntity.ok(timetableService.getStudentTimetable(studentId));
    }
}
