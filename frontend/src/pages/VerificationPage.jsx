import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function VerificationPage() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        navigate('/');
        return null;
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!code || code.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authAPI.verify({ email, code });
            setSuccess('Verification successful! You can now login.');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed');
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await authAPI.resend({ email });
            setSuccess('A new verification code has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Verify Your Email</h2>
                <p style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-muted)' }}>
                    We sent a 6-digit code to <strong>{email}</strong>
                </p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message" style={{ color: 'green', background: '#e8f5e9', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{success}</div>}

                <form onSubmit={handleVerify}>
                    <div className="form-group">
                        <label>Verification Code</label>
                        <input
                            type="text"
                            maxLength="6"
                            placeholder="123456"
                            value={code}
                            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                            required
                            style={{ fontSize: '24px', letterSpacing: '5px', textAlign: 'center', fontWeight: 'bold' }}
                        />
                    </div>

                    <button type="submit" className="custom-button btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : 'Verify Email'}
                    </button>

                    <p className="auth-footer" style={{ marginTop: '20px' }}>
                        Didn't receive the code?{' '}
                        <span
                            onClick={!loading ? handleResend : undefined}
                            style={{ color: '#4CAF50', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Resend Code
                        </span>
                    </p>
                    <p className="auth-footer">
                        <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
                            Back to Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
