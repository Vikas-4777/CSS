import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setUser } from '../utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.data);

      if (response.data.role === 'STUDENT') navigate('/student');
      else if (response.data.role === 'TEACHER') navigate('/teacher');
      else if (response.data.role === 'ADMIN') navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
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
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group icon-input">
                <span className="input-icon">🔒</span>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <div className="auth-footer">
              <div className="auth-links-row">
                <a href="/forgot-password">Forgot password?</a>
                <a href="/support">Support {'>'}</a>
              </div>
              <div className="auth-link">
                <a href="/register">Register new user?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
