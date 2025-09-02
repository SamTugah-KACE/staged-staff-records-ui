import React, { useState, useEffect } from 'react';
import './AlertNotifier.css';

const AlertNotifier = () => {
  const [alerts, setAlerts] = useState([]);

  // For demo, add a dummy alert every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) => [...prev, { id: Date.now(), message: 'New notification received!' }]);
      // Remove alert after 5 seconds
      setTimeout(() => {
        setAlerts((prev) => prev.slice(1));
      }, 5000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="alert-container">
      {alerts.map(alert => (
        <div key={alert.id} className="alert">
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default AlertNotifier;
