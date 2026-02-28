import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await authAPI.resetPassword({ email, newPassword });
            setMessage('Password reset successful! You can now login.');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-box" style={{ width: '100%', padding: '40px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Reset Password</h2>
                    <p style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-muted)' }}>
                        Enter your email and your new desired password.
                    </p>

                    {error && <div className="alert alert-error">{error}</div>}
                    {message && <div className="alert alert-success">{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group icon-input">
                            <span className="input-icon">✉️</span>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group icon-input">
                            <span className="input-icon">🔒</span>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Update Password</button>

                        <div className="auth-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
                            <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
                                Back to Login
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
