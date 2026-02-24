import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { adminAPI, courseAPI } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [message, setMessage] = useState('');

  const tabs = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'users', label: 'Manage Users' },
    { id: 'courses', label: 'All Courses' }
  ];

  useEffect(() => {
    loadAnalytics();
    loadUsers();
    loadCourses();
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

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <div className="main-content">
        <div className="header">
          <h1>Admin Dashboard</h1>
        </div>

        {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

        {activeTab === 'analytics' && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>{analytics.totalStudents || 0}</h4>
                <p>Total Students</p>
              </div>
              <div className="stat-card">
                <h4>{analytics.totalTeachers || 0}</h4>
                <p>Total Teachers</p>
              </div>
              <div className="stat-card">
                <h4>{analytics.totalCourses || 0}</h4>
                <p>Total Courses</p>
              </div>
              <div className="stat-card">
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
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span style={{color: user.active ? '#28a745' : '#dc3545'}}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{marginRight: '10px'}} 
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

        {activeTab === 'courses' && (
          <div className="card">
            <h3>All Courses</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Teacher</th>
                  <th>Sections</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.name}</td>
                    <td>{course.credits}</td>
                    <td>{course.teacherName}</td>
                    <td>{course.sections?.length || 0}</td>
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
