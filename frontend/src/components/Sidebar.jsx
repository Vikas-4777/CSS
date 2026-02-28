import { useState, useEffect } from 'react';
import { logout, getUser } from '../utils/auth';

export default function Sidebar({ activeTab, setActiveTab, tabs }) {
  const user = getUser();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>{user?.name}</h3>
        <p>{user?.role}</p>
      </div>
      <ul className="sidebar-menu">
        {tabs.map(tab => (
          <li key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </li>
        ))}
        <li onClick={toggleTheme} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Dark Mode</span>
          <div style={{
            width: '40px', height: '22px', background: isDarkMode ? '#6366f1' : '#cbd5e1',
            borderRadius: '11px', position: 'relative', transition: '0.3s'
          }}>
            <div style={{
              width: '18px', height: '18px', background: 'white', borderRadius: '50%',
              position: 'absolute', top: '2px', left: isDarkMode ? '20px' : '2px', transition: '0.3s'
            }} />
          </div>
        </li>
        <li onClick={logout} style={{ color: '#e74c3c', marginTop: '20px' }}>Logout</li>
      </ul>
    </div>
  );
}
