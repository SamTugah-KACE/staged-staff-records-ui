import React, { useState, useEffect } from 'react';
import './Inbox.css';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
const [open, setOpen] = useState(false);
  // In a real app, open a WebSocket connection here.
  useEffect(() => {
    // For demo, simulate a message every 15 seconds
    const interval = setInterval(() => {
      setMessages(prev => [...prev, { id: Date.now(), text: 'Realtime message from user X' }]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inbox">
      <h4>Inbox (24hr temporary)</h4>
      <ul>
        {messages.map(msg => (
          <li key={msg.id}>{msg.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default Inbox;
