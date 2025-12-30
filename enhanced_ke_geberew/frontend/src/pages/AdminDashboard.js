import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import LanguageSelector from '../components/LanguageSelector';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/get_stats.php`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/get_recent_activities.php`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/get_users.php`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleManageUsers = () => {
    setActiveTab('users');
  };

  const handleManageProducts = () => {
    alert(t('dashboard.manageProducts') + ' - Coming soon!');
  };

  const handleManageOrders = () => {
    alert(t('dashboard.manageOrders') + ' - Coming soon!');
  };

  const handleViewReports = () => {
    alert(t('dashboard.viewReports') + ' - Coming soon!');
  };

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>{t('dashboard.adminDashboard')}</h1>
          <LanguageSelector />
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{t('dashboard.totalUsers')}</h3>
                  <p className="stat-number">{stats.totalUsers}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🌾</div>
                <div className="stat-info">
                  <h3>{t('dashboard.totalProducts')}</h3>
                  <p className="stat-number">{stats.totalProducts}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{t('dashboard.totalOrders')}</h3>
                  <p className="stat-number">{stats.totalOrders}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{t('dashboard.pendingOrders')}</h3>
                  <p className="stat-number">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>{t('dashboard.systemManagement')}</h2>
              <div className="admin-actions">
                <button className="admin-btn" onClick={handleManageUsers}>
                  <span>👥</span> {t('dashboard.manageUsers')}
                </button>
                <button className="admin-btn" onClick={handleManageProducts}>
                  <span>🌾</span> {t('dashboard.manageProducts')}
                </button>
                <button className="admin-btn" onClick={handleManageOrders}>
                  <span>📦</span> {t('dashboard.manageOrders')}
                </button>
                <button className="admin-btn" onClick={handleViewReports}>
                  <span>📊</span> {t('dashboard.viewReports')}
                </button>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>{t('dashboard.recentActivity')}</h2>
              <div className="activity-list">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">📝</div>
                      <div className="activity-details">
                        <p className="activity-description">{activity.description}</p>
                        <span className="activity-date">
                          {new Date(activity.action_date).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">{t('dashboard.recentActivity')} - No activities yet</p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>{t('dashboard.manageUsers')}</h2>
              <button className="btn-back" onClick={() => setActiveTab('overview')}>
                ← Back
              </button>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{t('auth.name')}</th>
                    <th>{t('auth.email')}</th>
                    <th>{t('auth.location')}</th>
                    <th>{t('auth.selectRole')}</th>
                    <th>{t('dashboard.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.user_id}>
                      <td>{user.user_id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.location || 'N/A'}</td>
                      <td>{user.role}</td>
                      <td>
                        <button className="btn-action">{t('dashboard.edit')}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
