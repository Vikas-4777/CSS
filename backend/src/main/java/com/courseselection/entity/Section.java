package com.courseselection.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "sections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(nullable = false)
    private String sectionName;
    
    @Column(nullable = false)
    private Integer capacity = 50;
    
    @Column(nullable = false)
    private Integer enrolled = 0;
    
    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL)
    private List<Enrollment> enrollments;
}
