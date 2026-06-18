package com.courseselection.service;

import com.courseselection.entity.User;
import com.courseselection.entity.Course;
import com.courseselection.entity.Enrollment;
import com.courseselection.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@SuppressWarnings("null")
public class AdminService {
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final TimetableRepository timetableRepository;
    private final CourseService courseService;

    public AdminService(UserRepository userRepository, CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository, TimetableRepository timetableRepository,
            CourseService courseService) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.timetableRepository = timetableRepository;
        this.courseService = courseService;
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
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == User.Role.STUDENT) {
            timetableRepository.deleteByStudentId(userId);
            List<Enrollment> enrollments = enrollmentRepository.findByStudentId(userId);
            for (Enrollment e : enrollments) {
                // Update section enrolled count
                var section = e.getSection();
                if (section.getEnrolled() > 0) {
                    section.setEnrolled(section.getEnrolled() - 1);
                }
            }
            enrollmentRepository.deleteAll(enrollments);
        } else if (user.getRole() == User.Role.TEACHER) {
            List<Course> courses = courseRepository.findByTeacherId(userId);
            for (Course course : courses) {
                courseService.deleteCourse(course.getId());
            }
        }
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
