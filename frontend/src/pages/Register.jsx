import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setUser } from '../utils/auth';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    countryCode: '+91',
    phoneNumber: '',
    role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        phoneNumber: `${formData.countryCode} ${formData.phoneNumber}`.trim()
      };
      const response = await authAPI.register(dataToSubmit);
      setUser(response.data);

      if (response.data.role === 'STUDENT') navigate('/student');
      else if (response.data.role === 'TEACHER') navigate('/teacher');
      else if (response.data.role === 'ADMIN') navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="icon-badge animated-icons">
              <span className="book-icon">📖</span>
              <span className="pen-icon">✍️</span>
            </div>
            <h1 className="course-heading">Course<br />Registering<br />System</h1>
            <p>Smart course registration<br />& timetable management system</p>
          </div>
          <div className="light-streaks"></div>
          <div className="particles"></div>
        </div>
        <div className="auth-right">
          <div className="auth-box">
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group icon-input">
                <span className="input-icon">👤</span>
                <input type="text" placeholder="Full Name" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group icon-input">
                <span className="input-icon">✉️</span>
                <input type="email" placeholder="Email Address" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group icon-input">
                <span className="input-icon">🔒</span>
                <input type="password" placeholder="Password" value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              <div className="form-group icon-input" style={{ display: 'flex', gap: '10px' }}>
                <span className="input-icon">📱</span>
                <select
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  style={{ width: '100px', paddingLeft: '35px', paddingRight: '5px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: 'transparent' }}
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+971">+971 (AE)</option>
                </select>
                <input type="tel" placeholder="Phone Number" value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} required
                  style={{ flex: 1, paddingLeft: '10px' }}
                />
              </div>
              <div className="form-group icon-input">
                <span className="input-icon">🎓</span>
                <select value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Register</button>
            </form>
            <div className="auth-footer">
              <div className="auth-link">
                <a href="/">Already have an account? Login</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
