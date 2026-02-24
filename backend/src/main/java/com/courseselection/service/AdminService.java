package com.courseselection.service;

import com.courseselection.entity.User;
import com.courseselection.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    
    public AdminService(UserRepository userRepository, CourseRepository courseRepository, EnrollmentRepository enrollmentRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Transactional
    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.getActive());
        userRepository.save(user);
    }
    
    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
    
    public Map<String, Long> getAnalytics() {
        Map<String, Long> analytics = new HashMap<>();
        analytics.put("totalStudents", userRepository.findByRole(User.Role.STUDENT).stream().count());
        analytics.put("totalTeachers", userRepository.findByRole(User.Role.TEACHER).stream().count());
        analytics.put("totalCourses", courseRepository.count());
        analytics.put("totalEnrollments", enrollmentRepository.count());
        return analytics;
    }
}
