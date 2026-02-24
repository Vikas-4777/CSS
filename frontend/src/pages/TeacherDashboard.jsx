import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { courseAPI, enrollmentAPI } from '../services/api';
import { getUser } from '../utils/auth';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', credits: 3 });
  const [message, setMessage] = useState('');
  const user = getUser();

  const tabs = [
    { id: 'courses', label: 'My Courses' },
    { id: 'add', label: 'Add Course' }
  ];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await courseAPI.getByTeacher(user.userId);
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await courseAPI.create({ ...formData, teacherId: user.userId });
      setMessage('Course added successfully');
      setFormData({ name: '', credits: 3 });
      loadCourses();
      setActiveTab('courses');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to add course');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await courseAPI.delete(id);
      setMessage('Course deleted successfully');
      loadCourses();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to delete course');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const viewSectionStudents = async (section) => {
    try {
      const res = await enrollmentAPI.getBySection(section.id);
      setStudents(res.data);
      setSelectedSection(section);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <div className="main-content">
        <div className="header">
          <h1>Teacher Dashboard</h1>
        </div>

        {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

        {activeTab === 'courses' && (
          <div>
            {courses.map(course => (
              <div key={course.id} className="card">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <h3>{course.name}</h3>
                    <p>Credits: {course.credits}</p>
                  </div>
                  <button className="btn btn-danger" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                </div>
                <h4 style={{marginTop: '20px'}}>Sections:</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Capacity</th>
                      <th>Enrolled</th>
                      <th>Available</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.sections?.map(section => (
                      <tr key={section.id}>
                        <td>{section.sectionName}</td>
                        <td>{section.capacity}</td>
                        <td>{section.enrolled}</td>
                        <td>{section.capacity - section.enrolled}</td>
                        <td>
                          <button className="btn btn-primary" onClick={() => viewSectionStudents(section)}>
                            View Students
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="card">
            <h3>Add New Course</h3>
            <form onSubmit={handleAddCourse}>
              <div className="form-group">
                <label>Course Name</label>
                <input type="text" value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Credits</label>
                <input type="number" min="1" max="6" value={formData.credits} 
                  onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})} required />
              </div>
              <button type="submit" className="btn btn-primary">Add Course</button>
            </form>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Students in Section {selectedSection?.sectionName}</h3>
              <p>{selectedSection?.courseName}</p>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Enrolled At</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>{s.studentName}</td>
                      <td>{s.studentId}</td>
                      <td>{new Date(s.enrolledAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
