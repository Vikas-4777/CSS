package com.courseselection.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimetableDTO {
    private Long id;
    private String day;
    private String timeSlot;
    private Long courseId;
    private String courseName;
}
