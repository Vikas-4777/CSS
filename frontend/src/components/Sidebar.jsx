import { logout, getUser } from '../utils/auth';

export default function Sidebar({ activeTab, setActiveTab, tabs }) {
  const user = getUser();

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
        <li onClick={logout} style={{color: '#e74c3c', marginTop: '20px'}}>Logout</li>
      </ul>
    </div>
  );
}
