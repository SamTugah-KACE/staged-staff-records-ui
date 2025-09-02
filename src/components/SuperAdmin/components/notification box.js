import React, { useState } from 'react';
import './notification box.css';

const NotificationModal = ({ onClose, isDarkMode }) => {
  console.log('NotificationModal rendering - isDarkMode:', isDarkMode);

  const notifications = [
    { id: 1, sender: 'John Doe', message: 'Hello, can you help me?', timeSent: '10:00 AM' },
    { id: 2, sender: 'Jane Smith', message: 'Please review the document.', timeSent: '11:30 AM' },
    { id: 3, sender: 'Alice Johnson', message: 'Meeting at 2 PM.', timeSent: '12:45 PM' },
  ];
  console.log('Loaded notifications:', notifications);

  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  console.log('Current selectedNotificationId:', selectedNotificationId);

  const handleReplyClick = (id) => {
    console.log('Reply button clicked for notification ID:', id);
    setSelectedNotificationId(id);
  };

  const handleSendClick = () => {
    console.log('Send button clicked');
    alert('Reply sent successfully!');
    setSelectedNotificationId(null);
    console.log('Reset selectedNotificationId to null');
  };

  const handleClose = () => {
    console.log('Close button clicked');
    onClose();
  };

  return (
    <div className={`notification-modal-overlay ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="notification-modal-content">
        <h2>Inbox</h2>
        <div className="table-container">
          <table className="notification-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Message</th>
                <th>Time Sent</th>
                <th>Reply</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => {
                console.log('Rendering notification:', notification.id);
                return (
                  <React.Fragment key={notification.id}>
                    <tr>
                      <td>{notification.sender}</td>
                      <td>{notification.message}</td>
                      <td>{notification.timeSent}</td>
                      <td>
                        <button
                          className="reply-button"
                          onClick={() => handleReplyClick(notification.id)}
                        >
                          Reply
                        </button>
                      </td>
                    </tr>

                    {selectedNotificationId === notification.id && (
                      console.log('Rendering reply section for notification:', notification.id),
                      <tr className="reply-row">
                        <td colSpan="4">
                          <div className="reply-section">
                            <textarea
                              className="reply-box"
                              placeholder="Type your reply here..."
                            />
                            <div className="button-container">
                              <button className="send-button" onClick={handleSendClick}>
                                Send
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <button className="notification-close-button" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;