import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { courseAPI, enrollmentAPI, timetableAPI } from '../services/api';
import { getUser } from '../utils/auth';
import jsPDF from 'jspdf';

const getCourseDescription = (courseName) => {
  const name = String(courseName).toUpperCase();
  if (name.includes('FSAD') || name.includes('FULL STACK')) {
    return {
      title: 'Full Stack Application Development',
      importance: 'Equips you with end-to-end web engineering skills, bridging both front-end (React/UI) and back-end (Java/Databases) architectures.',
      useCases: 'Used globally to build robust enterprise software, scalable SaaS platforms, and dynamic e-commerce websites like Amazon, Netflix, and Vercel.'
    };
  }
  if (name === 'AI' || name.includes('ARTIFICIAL') || name.includes(' AI ') || name.startsWith('AI ') || name.endsWith(' AI')) {
    return {
      title: 'Artificial Intelligence',
      importance: 'Teaches machines to learn from data, driving the next revolution of automation and advanced human-computer interactions.',
      useCases: 'Applied heavily in self-driving cars (Tesla), personalized recommendation engines, financial fraud detection, and Generative AI.'
    };
  }
  if (name.includes('BLOCKCHAIN') || name.includes('BLOCK CHAIN')) {
    return {
      title: 'Foundations of Block Chain Engineering',
      importance: 'Provides a deep technical understanding of decentralized, immutable ledger systems, consensus algorithms, and executing secure, trustless transactions.',
      useCases: 'Fundamentally used in cryptocurrencies, engineering secure smart contracts, transparent supply chain tracking, and decentralized finance (DeFi).'
    };
  }
  if (name.includes('CLOUD')) {
    return {
      title: 'Cloud Computing',
      importance: 'Enables scalable, on-demand delivery of massive IT resources over the internet, eliminating old on-premise hardware constraints.',
      useCases: 'The absolute backbone of AWS, Google Cloud architectures, global application hosting, and enterprise disaster recovery systems.'
    };
  }
  if (name.includes('DATA SCIENCE') || name.includes('MACHINE LEARNING')) {
    return {
      title: 'Data Science & Machine Learning',
      importance: 'Transforms massive raw datasets into actionable predictive insights that dictate modern business strategies.',
      useCases: 'Utilized for algorithmic stock trading, medical diagnosis prediction, targeted marketing campaigns, and weather forecasting.'
    };
  }
  // Generic fallback
  return {
    title: courseName,
    importance: 'Develops critical thinking, deep analytical capability, and specialized knowledge essential for mastering modern professional environments.',
    useCases: 'Directly applicable in related industry sectors, academic corporate research, advanced technological innovations, and strategic problem-solving.'
  };
};

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

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
    { id: 'courses', label: 'Available Courses' },
    { id: 'enrolled', label: 'My Courses' },
    { id: 'timetable', label: 'Timetable' }
  ];

  useEffect(() => {
    loadCourses();
    loadEnrollments();
    loadTimetable();
    const currentPhone = parsePhone(user.phoneNumber);
    setCountryCode(currentPhone.code);
    setPhoneNumber(currentPhone.number);
    setEmail(user.email || user.sub || '');
  }, []);

  const loadCourses = async () => {
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data.filter(c => c.status === 'APPROVED'));
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

  const exportTimetable = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('My Timetable', 20, 20);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let y = 40;

    days.forEach(day => {
      const daySlots = timetable.filter(t => t.day === day);
      if (daySlots.length > 0) {
        doc.setFontSize(12);
        doc.text(day, 20, y);
        y += 10;
        daySlots.forEach(slot => {
          doc.setFontSize(10);
          doc.text(`${slot.timeSlot}: ${slot.courseName} (${slot.room || 'TBA'})`, 30, y);
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
  const totalCredits = enrollments.reduce((sum, e) => {
    const matchedCourse = courses.find(c => c.id === e.courseId);
    return sum + (matchedCourse ? matchedCourse.credits : 0);
  }, 0);
  const isOverloaded = totalCredits >= 18;

  // Conflict Radar Engine
  const getConflictWarning = (course) => {
    if (enrolledCourseIds.includes(course.id)) return null;
    let conflictSection = null;
    let enrolledConflict = null;

    if (!course.sections) return null;

    for (const section of course.sections) {
      if (!section.timetables) continue;

      for (const t of section.timetables) {
        for (const e of enrollments) {
          const enrolledCourse = courses.find(c => c.id === e.courseId);
          if (!enrolledCourse || !enrolledCourse.sections) continue;

          const enrolledSec = enrolledCourse.sections.find(s => s.sectionName === e.sectionName);
          if (!enrolledSec || !enrolledSec.timetables) continue;

          const conflict = enrolledSec.timetables.find(enrolledT =>
            enrolledT.day === t.day && enrolledT.timeSlot === t.timeSlot
          );

          if (conflict) {
            conflictSection = section.sectionName;
            enrolledConflict = enrolledCourse.name;
            break;
          }
        }
        if (conflictSection) break;
      }
      if (conflictSection) break;
    }

    if (conflictSection) {
      return `⚠️ Schedule Conflict with ${enrolledConflict}`;
    }
    return null;
  };

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <div className="main-content">
        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Student Dashboard</h1>
          {activeTab !== 'profile' && (
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{
                background: isOverloaded ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                border: `1px solid ${isOverloaded ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                padding: '10px 20px',
                borderRadius: '12px',
                color: isOverloaded ? '#ef4444' : '#22c55e',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}>
                <span style={{ fontSize: '18px' }}>🎓</span>
                <div>
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Active Credits</div>
                  <div style={{ fontSize: '16px' }}>{totalCredits} / 18</div>
                </div>
              </div>
            </div>
          )}
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

        {activeTab === 'courses' && (
          <div>
            <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ position: 'absolute', left: '16px', fontSize: '18px', color: 'var(--text-muted)' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search for courses by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 45px',
                    borderRadius: '30px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    fontSize: '15px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.04)',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
                Showing {filteredCourses.length} courses
              </div>
            </div>

            <div className="course-grid">
              {filteredCourses.map(course => {
                const conflictMsg = getConflictWarning(course);
                return (
                  <div key={course.id} className="course-card" style={{
                    position: 'relative',
                    border: conflictMsg ? '1px solid rgba(239, 68, 68, 0.4)' : undefined,
                    boxShadow: conflictMsg ? '0 10px 40px rgba(239, 68, 68, 0.05)' : undefined
                  }}>
                    {conflictMsg && (
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '20px',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)',
                        animation: 'pulseGlow 2s infinite'
                      }}>
                        {conflictMsg}
                      </div>
                    )}
                    <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: conflictMsg ? '10px' : '0' }}>
                      {course.name}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedCourse(course)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            background: 'none',
                            border: '1px solid var(--primary)',
                            color: 'var(--primary)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => { e.target.style.background = 'var(--primary)'; e.target.style.color = '#fff'; }}
                          onMouseOut={(e) => { e.target.style.background = 'none'; e.target.style.color = 'var(--primary)'; }}
                        >
                          VIEW INFO
                        </button>
                      </div>
                    </h4>
                    <p>Credits: {course.credits}</p>
                    <p>Teacher: {course.teacherName || 'Unassigned'}</p>
                    {enrolledCourseIds.includes(course.id) && (
                      <p style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Enrolled</p>
                    )}
                    <div className="sections">
                      {course.sections?.map(section => {
                        const isFull = section.enrolled >= section.capacity;

                        // Micro-Conflict check at the section level
                        let hasSectionConflict = false;
                        if (section.timetables) {
                          for (const t of section.timetables) {
                            for (const e of enrollments) {
                              const actCourse = courses.find(c => c.id === e.courseId);
                              if (!actCourse || !actCourse.sections) continue;
                              const actSec = actCourse.sections.find(s => s.sectionName === e.sectionName);
                              if (!actSec || !actSec.timetables) continue;

                              if (actSec.timetables.some(enrolledT => enrolledT.day === t.day && enrolledT.timeSlot === t.timeSlot)) {
                                hasSectionConflict = true;
                              }
                            }
                          }
                        }

                        return (
                          <button key={section.id}
                            className={`section-btn ${isFull ? 'full' : ''}`}
                            style={{
                              opacity: hasSectionConflict ? 0.5 : 1,
                              border: hasSectionConflict ? '1px dashed var(--danger)' : undefined,
                              position: 'relative'
                            }}
                            disabled={isFull || !section.available || enrolledCourseIds.includes(course.id) || hasSectionConflict}
                            onClick={() => handleEnroll(section.id)}>
                            {section.sectionName}<br />
                            {isFull ? (
                              <span style={{ fontWeight: 'bold' }}>FULL</span>
                            ) : hasSectionConflict ? (
                              <span style={{ color: 'var(--danger)', fontSize: '10px' }}>CONFLICT</span>
                            ) : (
                              `${section.enrolled}/${section.capacity}`
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left', padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 5px 0' }}>{user.name}</h2>
                <div style={{ background: 'var(--table-hover)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-block', fontWeight: 'bold' }}>
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

        {activeTab === 'enrolled' && (
          <div className="card">
            <h3>My Enrolled Courses</h3>
            {enrollments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.5 }}>📚</div>
                <h4 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--text-main)' }}>No Courses Yet!</h4>
                <p>You haven't enrolled in any courses for this semester.</p>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="btn-primary"
                  style={{ marginTop: '20px', padding: '10px 24px', fontSize: '14px' }}
                >
                  Browse Available Courses
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Section</th>
                      <th>Enrolled At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map(e => (
                      <tr key={e.id}>
                        <td>{e.courseName}</td>
                        <td>{e.sectionName}</td>
                        <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-danger" style={{ padding: '6px 16px', fontSize: '13px' }} onClick={() => handleDrop(e.courseId)}>
                            Drop
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>My Timetable</h3>
              {timetable.length > 0 && <button className="btn btn-primary" onClick={exportTimetable}>Export PDF</button>}
            </div>
            {timetable.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.5 }}>📅</div>
                <h4 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--text-main)' }}>Your Schedule is Empty!</h4>
                <p>Enroll in courses to automatically generate your weekly timetable.</p>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="btn-primary"
                  style={{ marginTop: '20px', padding: '10px 24px', fontSize: '14px' }}
                >
                  Browse Courses
                </button>
              </div>
            ) : (
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
                          // Support both old formatting (Monday) and new (Mon) strings from DB/State gracefully
                          let searchDay = day;
                          if (day === 'Mon') searchDay = 'Monday';
                          if (day === 'Tue') searchDay = 'Tuesday';
                          if (day === 'Wed') searchDay = 'Wednesday';
                          if (day === 'Thu') searchDay = 'Thursday';
                          if (day === 'Fri') searchDay = 'Friday';
                          if (day === 'Sat') searchDay = 'Saturday';

                          let searchPeriod = String(period);
                          if (period === 1) searchPeriod = '09:00-10:30';
                          if (period === 2) searchPeriod = '10:45-12:15';
                          if (period === 3) searchPeriod = '13:15-14:45';
                          if (period === 5) searchPeriod = '15:00-16:30';

                          const slot = timetable.find(t => (t.day === day || t.day === searchDay) && (String(t.timeSlot) === String(period) || String(t.timeSlot) === searchPeriod));
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
            )}
          </div>
        )}
        {/* Course Details Modal */}
        {selectedCourse && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'var(--dark-glass)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}>
            <div className="card" style={{
              width: '90%', maxWidth: '500px', padding: '30px',
              position: 'relative', animation: 'fadeInUp 0.3s ease-out',
              border: '1px solid var(--border-color)'
            }}>
              <button
                onClick={() => setSelectedCourse(null)}
                style={{
                  position: 'absolute', top: '15px', right: '15px',
                  background: 'none', border: 'none', fontSize: '24px',
                  color: 'var(--text-muted)', cursor: 'pointer'
                }}
              >
                ×
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  color: 'white', fontSize: '24px', fontWeight: 'bold'
                }}>
                  {selectedCourse.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '22px' }}>{selectedCourse.name}</h2>
                  <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                    Course ID: #{selectedCourse.id}
                  </p>
                </div>
              </div>

              {/* Dynamic Description Box */}
              <div style={{
                background: 'var(--input-bg)',
                borderLeft: '4px solid var(--primary)',
                padding: '15px',
                borderRadius: '0 8px 8px 0',
                marginBottom: '20px',
                fontSize: '13px',
                color: 'var(--text-color)'
              }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--primary)' }}>
                  {getCourseDescription(selectedCourse.name).title}
                </h4>
                <p style={{ margin: '0 0 10px 0', lineHeight: '1.5' }}>
                  <strong>Importance:</strong> {getCourseDescription(selectedCourse.name).importance}
                </p>
                <p style={{ margin: 0, lineHeight: '1.5' }}>
                  <strong>Real-World Use:</strong> {getCourseDescription(selectedCourse.name).useCases}
                </p>
              </div>

              <div style={{
                background: 'var(--table-hover)', padding: '15px',
                borderRadius: '8px', marginBottom: '20px', display: 'flex',
                gap: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>CREDITS</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedCourse.credits}</div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>INSTRUCTOR</div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>{selectedCourse.teacherName || 'TBA'}</div>
                </div>
              </div>

              {/* dynamic sections rendering in Modal */}
              <h4 style={{ marginBottom: '10px' }}>Available Sections</h4>
              {selectedCourse.sections && selectedCourse.sections.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedCourse.sections.map(sec => {
                    let hasSectionConflict = false;
                    if (sec.timetables) {
                      for (const t of sec.timetables) {
                        for (const e of enrollments) {
                          const actCourse = courses.find(c => c.id === e.courseId);
                          if (!actCourse || !actCourse.sections) continue;
                          const actSec = actCourse.sections.find(s => s.sectionName === e.sectionName);
                          if (!actSec || !actSec.timetables) continue;

                          if (actSec.timetables.some(enrolledT => enrolledT.day === t.day && enrolledT.timeSlot === t.timeSlot)) {
                            hasSectionConflict = true;
                          }
                        }
                      }
                    }

                    return (
                      <div key={sec.id} style={{
                        padding: '12px 15px', border: hasSectionConflict ? '1px dashed var(--danger)' : '1px solid var(--border-color)',
                        borderRadius: '8px', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', opacity: hasSectionConflict ? 0.7 : 1
                      }}>
                        <div>
                          <strong style={{ display: 'block' }}>Section {sec.sectionName}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {sec.enrolled} / {sec.capacity} Enrolled
                          </span>
                        </div>

                        {enrolledCourseIds.includes(selectedCourse.id) ? (
                          <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 'bold' }}>✓ REGISTERED</span>
                        ) : sec.enrolled >= sec.capacity ? (
                          <span style={{ color: 'var(--danger)', fontSize: '12px', fontWeight: 'bold' }}>FULL</span>
                        ) : hasSectionConflict ? (
                          <span style={{ color: 'var(--danger)', fontSize: '12px', fontWeight: 'bold' }}>CONFLICT</span>
                        ) : (
                          <button
                            onClick={() => {
                              handleEnroll(sec.id);
                              setSelectedCourse(null);
                            }}
                            className="btn-primary"
                            style={{ padding: '6px 15px', margin: 0, fontSize: '13px' }}
                          >
                            Enroll
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No sections available for this term.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
