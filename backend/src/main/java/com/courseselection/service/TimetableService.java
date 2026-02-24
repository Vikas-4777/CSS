package com.courseselection.service;

import com.courseselection.dto.TimetableDTO;
import com.courseselection.entity.Timetable;
import com.courseselection.repository.TimetableRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimetableService {
    private final TimetableRepository timetableRepository;
    
    public TimetableService(TimetableRepository timetableRepository) {
        this.timetableRepository = timetableRepository;
    }
    
    public List<TimetableDTO> getStudentTimetable(Long studentId) {
        return timetableRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private TimetableDTO convertToDTO(Timetable timetable) {
        TimetableDTO dto = new TimetableDTO();
        dto.setId(timetable.getId());
        dto.setDay(timetable.getDay());
        dto.setTimeSlot(timetable.getTimeSlot());
        dto.setCourseId(timetable.getCourse().getId());
        dto.setCourseName(timetable.getCourse().getName());
        return dto;
    }
}
