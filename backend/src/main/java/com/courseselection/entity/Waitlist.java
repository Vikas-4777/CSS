package com.courseselection.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "waitlist")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Waitlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;
    
    @Column(nullable = false)
    private LocalDateTime addedAt = LocalDateTime.now();
}
