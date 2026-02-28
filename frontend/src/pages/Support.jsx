import { useNavigate } from 'react-router-dom';

export default function Support() {
    const navigate = useNavigate();

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '600px', flexDirection: 'column', padding: '50px', background: 'white' }}>
                <h2 style={{ color: 'var(--dark)', marginBottom: '20px', fontSize: '32px' }}>Support Center</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '16px' }}>
                    Welcome to the Course Registration Support Center. If you are experiencing any issues, please review our FAQs or contact the administration directly.
                </p>

                <div style={{ marginBottom: '25px', textAlign: 'left' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Q: I can't register for a course because it says "Time conflict". What do I do?</h4>
                    <p style={{ color: 'var(--text-main)', fontSize: '15px' }}>
                        A: This means the deterministic time slot for this new course overlaps with one you've already enrolled in. You will need to drop the conflicting course first.
                    </p>
                </div>

                <div style={{ marginBottom: '25px', textAlign: 'left' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Q: Where can I see my classroom number?</h4>
                    <p style={{ color: 'var(--text-main)', fontSize: '15px' }}>
                        A: Your classroom number (e.g., R101, R203) is visible directly on your Timetable tab in the Student Dashboard.
                    </p>
                </div>

                <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
                    Back to Login
                </button>
            </div>
        </div>
    );
}
