package com.courseselection.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long id;
    private String name;
    private Integer credits;
    private Long teacherId;
    private String teacherName;
    private List<SectionDTO> sections;
}
