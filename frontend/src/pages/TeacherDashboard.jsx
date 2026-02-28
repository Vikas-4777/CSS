import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { courseAPI, enrollmentAPI, timetableAPI } from '../services/api';
import { getUser } from '../utils/auth';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [timetable, setTimetable] = useState([]);
  const [formData, setFormData] = useState({ name: '', credits: 3 });
  const [message, setMessage] = useState('');

  const parsePhone = (phone) => {
    if (!phone) return { code: '+91', number: '' };
    const parts = phone.split(' ');
    if (parts.length > 1 && parts[0].startsWith('+')) {
      return { code: parts[0], number: parts.slice(1).join(' ') };
    }
    return { code: '+91', number: phone };
  };

  const [user, setLocalUser] = useState(getUser());
  const initialPhone = parsePhone(user.phoneNumber);
  const [countryCode, setCountryCode] = useState(initialPhone.code);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone.number);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const tabs = [
    { id: 'profile', label: 'My Profile' },
    { id: 'courses', label: 'My Courses' },
    { id: 'add', label: 'Add Course' },
    { id: 'timetable', label: 'My Timetable' }
  ];

  useEffect(() => {
    loadCourses();
    loadTimetable();
    const currentPhone = parsePhone(user.phoneNumber);
    setCountryCode(currentPhone.code);
    setPhoneNumber(currentPhone.number);
    setEmail(user.email || user.sub || '');
  }, []);

  const loadCourses = async () => {
    try {
      const res = await courseAPI.getByTeacher(user.userId);
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTimetable = async () => {
    try {
      const res = await timetableAPI.getByTeacher(user.userId);
      setTimetable(res.data);
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

  const handleUpdateProfile = async () => {
    try {
      const { authAPI } = await import('../services/api');
      const { setUser } = await import('../utils/auth');
      const fullPhoneNumber = `${countryCode} ${phoneNumber}`.trim();
      const res = await authAPI.updateProfile(user.userId, { phoneNumber: fullPhoneNumber, email });
      setUser(res.data);
      setLocalUser(res.data);
      setIsEditingPhone(false);
      setIsEditingEmail(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update profile');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <div className="main-content">
        <div className="header">
          <h1>Teacher Dashboard</h1>
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

        {activeTab === 'profile' && (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left', padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ margin: '0 0 5px 0' }}>{user.name}</h2>
                <div style={{ background: '#e0e7ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-block', fontWeight: 'bold' }}>
                  {user.role}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', display: 'block' }}>Email Address</strong>
                  {!isEditingEmail && (
                    <button
                      onClick={() => {
                        setEmail(user.email || user.sub || '');
                        setIsEditingEmail(true);
                      }}
                      style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '12px', padding: 0, fontWeight: 'bold' }}
                    >
                      Edit
                    </button>
                  )}
                </div>
                {isEditingEmail ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', flex: '1', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }}
                    />
                    <button onClick={handleUpdateProfile} className="btn-primary" style={{ padding: '8px 16px', width: 'auto', margin: 0 }}>
                      Save
                    </button>
                    <button onClick={() => setIsEditingEmail(false)} style={{ padding: '8px 16px', width: 'auto', margin: 0, backgroundColor: 'var(--table-hover)', color: 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: '500' }}>{user.email || user.sub}</p>
                )}
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Account Status</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: '500', color: '#22c55e' }}>Active</p>
              </div>
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', display: 'block' }}>Phone Number</strong>
                  {!isEditingPhone && (
                    <button
                      onClick={() => {
                        const current = parsePhone(user.phoneNumber);
                        setCountryCode(current.code);
                        setPhoneNumber(current.number);
                        setIsEditingPhone(true);
                      }}
                      style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '12px', padding: 0, fontWeight: 'bold' }}
                    >
                      Edit
                    </button>
                  )}
                </div>
                {isEditingPhone ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', width: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }}
                    >
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+61">+61 (AU)</option>
                      <option value="+971">+971 (AE)</option>
                    </select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', flex: '1', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }}
                    />
                    <button onClick={handleUpdateProfile} className="btn-primary" style={{ padding: '8px 16px', width: 'auto', margin: 0 }}>
                      Save
                    </button>
                    <button onClick={() => setIsEditingPhone(false)} style={{ padding: '8px 16px', width: 'auto', margin: 0, backgroundColor: 'var(--table-hover)', color: 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: '500' }}>
                    {user.phoneNumber || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            {courses.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                <h3 style={{ color: 'var(--text-muted)' }}>No courses found</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>You have not added any courses yet. Go to 'Add Course' to get started.</p>
              </div>
            )}
            {courses.map(course => (
              <div key={course.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      {course.name}
                      <span style={{
                        fontSize: '12px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: course.status === 'APPROVED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: course.status === 'APPROVED' ? '#22c55e' : '#f59e0b',
                        border: `1px solid ${course.status === 'APPROVED' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                        fontWeight: '600',
                        letterSpacing: '0.3px'
                      }}>
                        {course.status === 'APPROVED' ? '✓ Course successfully added' : '⏳ Waiting for admin approval'}
                      </span>
                    </h3>
                    <p>Credits: {course.credits}</p>
                  </div>
                  <button className="btn btn-danger" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                </div>
                <h4 style={{ marginTop: '20px' }}>Sections:</h4>
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
                    {course.sections?.map(section => {
                      const available = section.capacity - section.enrolled;
                      const isFull = available <= 0;
                      return (
                        <tr key={section.id}>
                          <td>{section.sectionName}</td>
                          <td>{section.capacity}</td>
                          <td>{section.enrolled}</td>
                          <td>
                            {isFull ? (
                              <span style={{ background: 'var(--danger)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>FULL</span>
                            ) : (
                              <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{available}</span>
                            )}
                          </td>
                          <td>
                            <button className="btn btn-primary" onClick={() => viewSectionStudents(section)}>
                              View Students
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Credits</label>
                <input type="number" min="1" max="6" value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })} required />
              </div>
              <button type="submit" className="btn btn-primary">Add Course</button>
            </form>
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>My Teaching Timetable</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead style={{ background: '#3498db', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '10px', border: '1px solid #2980b9' }}>DAY</th>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(p => (
                      <th key={p} style={{ padding: '10px', border: '1px solid #2980b9' }}>{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <tr key={day}>
                      <td style={{ fontWeight: 'bold', border: '1px solid var(--border-color)', background: 'var(--table-hover)' }}>{day}</td>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(period => {
                        if (period === 3 || period === 10) {
                          if (day === 'Mon') return <td key={period} rowSpan="6" style={{ background: 'var(--table-hover)', border: '1px solid var(--border-color)', writingMode: 'vertical-rl', textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold', color: 'var(--text-color)' }}>BREAK</td>;
                          return null;
                        }
                        if (period === 6) {
                          if (day === 'Mon') return <td key={period} rowSpan="6" style={{ background: 'var(--table-hover)', border: '1px solid var(--border-color)', writingMode: 'vertical-rl', textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold', color: 'var(--text-color)' }}>LUNCH BREAK</td>;
                          return null;
                        }

                        let searchPeriod = String(period);
                        if (period === 1) searchPeriod = '09:00-10:30';
                        if (period === 2) searchPeriod = '10:45-12:15';
                        if (period === 3) searchPeriod = '13:15-14:45';
                        if (period === 5) searchPeriod = '15:00-16:30';

                        const slot = timetable.find(t => t.day === day && (String(t.timeSlot) === String(period) || String(t.timeSlot) === searchPeriod));
                        return (
                          <td key={period} style={{ border: '1px solid var(--border-color)', padding: '5px', fontSize: '11px', minWidth: '70px', height: '60px' }}>
                            {slot ? (
                              <div style={{ lineHeight: '1.4' }}>
                                <strong>{slot.courseName}</strong><br />
                                <span style={{ color: 'var(--text-muted)' }}>RoomNo-{slot.room || 'TBA'}</span>
                              </div>
                            ) : '-'}
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
                      <td>{s.studentEmail}</td>
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
