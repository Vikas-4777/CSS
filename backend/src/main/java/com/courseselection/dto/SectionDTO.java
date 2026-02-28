package com.courseselection.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SectionDTO {
    private Long id;
    private Long courseId;
    private String courseName;
    private String sectionName;
    private Integer capacity;
    private Integer enrolled;
    private Boolean available;
}
