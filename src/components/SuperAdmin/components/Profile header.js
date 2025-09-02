import React, { useState } from 'react';
import { IoNotifications } from "react-icons/io5";
import profile from './assets/im.jpg';
import NotificationModal from './notification box'; 
import './Profile header.css'

const ProfileHeader = ({ toggleDarkMode, isDarkMode }) => { 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNotificationClick = () => setIsModalOpen(true); 
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <header className="profile-header"> 
      <div className="header-controls">
        <button 
          className="notification-button" 
          onClick={handleNotificationClick}
          aria-label="Notifications"
          type="button" 
        >
          <IoNotifications className="notification-icon" />
          <span className="notification-badge">3</span>
        </button>

        <div className="profile-container">
          <img 
            src={profile} 
            alt="User profile" 
            className="profile-image" 
            width="40"     
            height="40" 
            loading="lazy" 
          />
          <div className="profile-details">
            <span className="profile-name">Mr. Godsmark</span>
            <span className="profile-role">Admin</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <NotificationModal 
          onClose={handleCloseModal} 
          isDarkMode={isDarkMode}
        />
      )}
    </header>
  );
};

export default ProfileHeader; 