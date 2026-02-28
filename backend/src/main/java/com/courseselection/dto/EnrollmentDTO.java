package com.courseselection.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long sectionId;
    private String sectionName;
    private Long courseId;
    private String courseName;
    private String enrolledAt;
}
