import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { courseAPI, enrollmentAPI, timetableAPI } from '../services/api';
import { getUser } from '../utils/auth';
import jsPDF from 'jspdf';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const user = getUser();

  const tabs = [
    { id: 'courses', label: 'Available Courses' },
    { id: 'enrolled', label: 'My Courses' },
    { id: 'timetable', label: 'Timetable' }
  ];

  useEffect(() => {
    loadCourses();
    loadEnrollments();
    loadTimetable();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadEnrollments = async () => {
    try {
      const res = await enrollmentAPI.getByStudent(user.userId);
      setEnrollments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTimetable = async () => {
    try {
      const res = await timetableAPI.getByStudent(user.userId);
      setTimetable(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnroll = async (sectionId) => {
    try {
      const res = await enrollmentAPI.enroll({ studentId: user.userId, sectionId });
      setMessage(res.data.message);
      loadCourses();
      loadEnrollments();
      loadTimetable();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Enrollment failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDrop = async (courseId) => {
    if (!confirm('Are you sure you want to drop this course?')) return;
    try {
      await enrollmentAPI.drop(user.userId, courseId);
      setMessage('Course dropped successfully');
      loadCourses();
      loadEnrollments();
      loadTimetable();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Drop failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const exportTimetable = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('My Timetable', 20, 20);
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let y = 40;
    
    days.forEach(day => {
      const daySlots = timetable.filter(t => t.day === day);
      if (daySlots.length > 0) {
        doc.setFontSize(12);
        doc.text(day, 20, y);
        y += 10;
        daySlots.forEach(slot => {
          doc.setFontSize(10);
          doc.text(`${slot.timeSlot}: ${slot.courseName}`, 30, y);
          y += 8;
        });
        y += 5;
      }
    });
    
    doc.save('timetable.pdf');
  };

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const enrolledCourseIds = enrollments.map(e => e.courseId);

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <div className="main-content">
        <div className="header">
          <h1>Student Dashboard</h1>
        </div>

        {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

        {activeTab === 'courses' && (
          <div>
            <div className="search-bar">
              <input type="text" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="course-grid">
              {filteredCourses.map(course => (
                <div key={course.id} className="course-card">
                  <h4>{course.name}</h4>
                  <p>Credits: {course.credits}</p>
                  <p>Teacher: {course.teacherName}</p>
                  {enrolledCourseIds.includes(course.id) && (
                    <p style={{color: '#28a745', fontWeight: 'bold'}}>✓ Enrolled</p>
                  )}
                  <div className="sections">
                    {course.sections?.map(section => (
                      <button key={section.id} className="section-btn"
                        disabled={!section.available || enrolledCourseIds.includes(course.id)}
                        onClick={() => handleEnroll(section.id)}>
                        {section.sectionName}<br/>
                        {section.enrolled}/{section.capacity}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'enrolled' && (
          <div className="card">
            <h3>My Enrolled Courses</h3>
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Section</th>
                  <th>Enrolled At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map(e => (
                  <tr key={e.id}>
                    <td>{e.courseName}</td>
                    <td>{e.sectionName}</td>
                    <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDrop(e.courseId)}>Drop</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3>My Timetable</h3>
              <button className="btn btn-primary" onClick={exportTimetable}>Export PDF</button>
            </div>
            <div className="timetable">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                  </tr>
                </thead>
                <tbody>
                  {['09:00-10:30', '10:45-12:15', '13:15-14:45', '15:00-16:30'].map(time => (
                    <tr key={time}>
                      <td>{time}</td>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                        const slot = timetable.find(t => t.day === day && t.timeSlot === time);
                        return (
                          <td key={day}>
                            {slot && <div className="timetable-slot">{slot.courseName}</div>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
