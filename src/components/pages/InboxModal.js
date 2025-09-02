// src/components/InboxModal.js
import React from 'react';
import './InboxModal.css';

const InboxModal = ({ onClose }) => {
  // Sample data for demonstration
  const messages = [
    { sender: 'Alice', message: 'Hello, how are you?', time: '10:30 AM' },
    { sender: 'Bob', message: 'Meeting at 3 PM', time: '9:15 AM' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="inbox-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Inbox</h2>
        <table>
          <thead>
            <tr>
              <th>Sender</th>
              <th>Message</th>
              <th>Time Sent</th>
              <th>Reply</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, idx) => (
              <tr key={idx}>
                <td>{msg.sender}</td>
                <td>{msg.message}</td>
                <td>{msg.time}</td>
                <td>
                  <button className="reply-btn" onClick={() => alert('Reply clicked')}>Reply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="reply-form">
          <textarea placeholder="Type your reply here..." />
          <button className="send-btn" onClick={() => alert('Message sent!')}>Send</button>
        </div>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default InboxModal;
