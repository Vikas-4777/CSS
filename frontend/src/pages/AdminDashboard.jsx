import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { adminAPI, courseAPI } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [message, setMessage] = useState('');
  const [editingCourseId, setEditingCourseId] = useState(null);

  const tabs = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'users', label: 'Manage Users' },
    { id: 'courses', label: 'All Courses' }
  ];

  useEffect(() => {
    loadAnalytics();
    loadUsers();
    loadCourses();
    loadEnrollments();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await adminAPI.getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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
      // Use standard export naming for consistency or fetch via enrollmentAPI
      const { enrollmentAPI } = await import('../services/api');
      const res = await enrollmentAPI.getAll();
      setEnrollments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      await adminAPI.toggleUser(userId);
      setMessage('User status updated');
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update user');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      setMessage('User deleted successfully');
      loadUsers();
      loadAnalytics();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to delete user');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAssignTeacher = async (courseId, teacherId) => {
    try {
      await courseAPI.assign(courseId, teacherId);
      setMessage('Teacher assigned successfully');
      setEditingCourseId(null);
      loadCourses();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to assign teacher');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleApproveCourse = async (courseId) => {
    try {
      await courseAPI.approve(courseId);
      setMessage('Course approved successfully');
      loadCourses();
      loadAnalytics();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to approve course');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const teachers = users.filter(u => u.role === 'TEACHER' && u.active);

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <div className="main-content">
        <div className="header">
          <h1>Admin Dashboard</h1>
        </div>

        {/* Animated Toast Notification */}
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: message ? '30px' : '-400px',
          opacity: message ? 1 : 0,
          background: message && message.includes('success') ? 'var(--card-bg)' : 'var(--danger)',
          borderLeft: message && message.includes('success') ? '5px solid var(--success)' : '5px solid #fff',
          color: message && message.includes('success') ? 'var(--text-color)' : 'white',
          padding: '20px 25px',
          borderRadius: '12px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          zIndex: 9999,
          fontWeight: 'bold',
          maxWidth: '400px'
        }}>
          <div style={{
            fontSize: '24px',
            background: message && message.includes('success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            width: '40px', height: '40px', borderRadius: '50%',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            {message && message.includes('success') ? '✅' : '❌'}
          </div>
          <div style={{ flex: 1 }}>{message}</div>
        </div>

        {activeTab === 'analytics' && (
          <div>
            <div className="stats-grid">
              <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('studentsList')}>
                <h4>{analytics.totalStudents || 0}</h4>
                <p>Total Students</p>
              </div>
              <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('teachersList')}>
                <h4>{analytics.totalTeachers || 0}</h4>
                <p>Total Teachers</p>
              </div>
              <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('courses')}>
                <h4>{analytics.totalCourses || 0}</h4>
                <p>Total Courses</p>
              </div>
              <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('enrollmentsList')}>
                <h4>{analytics.totalEnrollments || 0}</h4>
                <p>Total Enrollments</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card">
            <h3>All Users</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span style={{ color: user.active ? '#28a745' : '#dc3545' }}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ marginRight: '10px' }}
                        onClick={() => handleToggleUser(user.id)}>
                        {user.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeTab === 'studentsList' || activeTab === 'teachersList') && (
          <div className="card">
            <button className="btn btn-secondary" style={{ marginBottom: '20px' }} onClick={() => setActiveTab('analytics')}>
              ← Back to Analytics
            </button>
            <h3>{activeTab === 'studentsList' ? 'All Students' : 'All Teachers'}</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role === (activeTab === 'studentsList' ? 'STUDENT' : 'TEACHER')).map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span style={{ color: user.active ? '#28a745' : '#dc3545' }}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'enrollmentsList' && (
          <div className="card">
            <button className="btn btn-secondary" style={{ marginBottom: '20px' }} onClick={() => setActiveTab('analytics')}>
              ← Back to Analytics
            </button>
            <h3>All Enrollments</h3>
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Student Name</th>
                  <th>Course Name</th>
                  <th>Section Name</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enr, i) => (
                  <tr key={enr.id}>
                    <td>{i + 1}</td>
                    <td>{enr.studentName || `Student ${enr.studentId}`}</td>
                    <td>{enr.courseName}</td>
                    <td>{enr.sectionName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="card">
            <h3>All Courses</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Status</th>
                  <th>Teacher</th>
                  <th>Sections</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course.id}>
                    <td>{index + 1}</td>
                    <td>{course.name}</td>
                    <td>{course.credits}</td>
                    <td>
                      <span style={{ fontWeight: 'bold', color: course.status === 'APPROVED' ? '#22c55e' : '#f59e0b' }}>
                        {course.status || 'PENDING'}
                      </span>
                    </td>
                    <td>
                      {editingCourseId === course.id ? (
                        <select
                          autoFocus
                          defaultValue={course.teacherId || ''}
                          onChange={(e) => handleAssignTeacher(course.id, e.target.value)}
                          onBlur={() => setEditingCourseId(null)}
                        >
                          <option value="" disabled>Select Teacher</option>
                          {teachers.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      ) : (
                        course.teacherName || 'Unassigned'
                      )}
                    </td>
                    <td>{course.sections?.length || 0}</td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => setEditingCourseId(course.id)}
                      >
                        Assign Teacher
                      </button>
                      {course.status !== 'APPROVED' && (
                        <button
                          className="btn-primary"
                          onClick={() => handleApproveCourse(course.id)}
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
