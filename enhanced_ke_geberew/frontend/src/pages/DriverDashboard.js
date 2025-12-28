import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';
import { AuthContext } from '../contexts/AuthContext';

const DriverDashboard = () => {
  const { user } = useContext(AuthContext);
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/drivers/get_assigned_deliveries.php?driver_id=${user.id}`)
      .then(res => res.json())
      .then(data => setDeliveries(data))
      .catch(err => console.error(err));
  }, [user]);

  const updateDeliveryStatus = (orderId, newStatus) => {
    fetch('/api/drivers/update_delivery_status.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: orderId,
        driver_id: user.id,
        status: newStatus
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid status');
        return res.json();
      })
      .then(() => {
        setDeliveries(deliveries.map(d =>
          d.id === orderId ? { ...d, status: newStatus } : d
        ));
      })
      .catch(() => alert('Status update failed'));
  };

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-container">
        <h1>Driver Dashboard</h1>

        <div className="dashboard-section">
          <h2>My Deliveries</h2>

          {deliveries.length === 0 ? (
            <p>No active deliveries</p>
          ) : (
            deliveries.map(delivery => (
              <div key={delivery.id} className="delivery-card">
                <h3>Order #{delivery.id}</h3>
                <p><strong>Status:</strong> {delivery.status}</p>

                {delivery.status === 'Assigned' && (
                  <button
                    className="btn-primary"
                    onClick={() => updateDeliveryStatus(delivery.id, 'In Transit')}
                  >
                    Start Delivery
                  </button>
                )}

                {delivery.status === 'In Transit' && (
                  <button
                    className="btn-success"
                    onClick={() => updateDeliveryStatus(delivery.id, 'Delivered')}
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
