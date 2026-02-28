package com.courseselection.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_timetable")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Timetable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(name = "day_name", nullable = false)
    private String day;
    
    @Column(name = "time_slot", nullable = false)
    private String timeSlot;
    
    @Column(name = "room")
    private String room;
}
