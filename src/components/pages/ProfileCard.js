
// src/components/ProfileCard.js
import React, { useState } from 'react';
import './ProfileCard.css';
import userAvatar from '../../assets/images/avatar.jpeg';
import { FaEnvelope } from 'react-icons/fa';
import InboxModal from './InboxModal';
import { useAuth } from '../../context/AuthContext';

const ProfileCard = () => {
  const { auth } = useAuth();
  const user = auth.user || {username: "Guest", role: "Guest", image_path: userAvatar};
 const name = auth.user_name;
 const role = auth.role;

  // Simulated profile data and unread count
  const [profile, setProfile] = useState({ username: 'John Doe', role: 'CEO', avatar: userAvatar });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showInboxModal, setShowInboxModal] = useState(false);
  const [unreadCount] = useState(3); // Example unread messages count

  // Opens the profile update modal when the card is clicked
  const openProfileModal = () => setShowProfileModal(true);

  // Opens the inbox modal; prevent propagation to avoid triggering the profile update modal
  const openInboxModal = (e) => {
    e.stopPropagation();
    setShowInboxModal(true);
  };

  const handleUpdate = () => {
    // In production, update profile info via API
    alert('Profile updated!');
    setShowProfileModal(false);
  };

  return (
    <div className="profile-card-container">
     
      <button className="inbox-btn" onClick={openInboxModal}>
        <FaEnvelope className="inbox-icon" />
        {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
      </button>


      <div className="profile-card" onClick={openProfileModal}>
        {/* <img src={profile.avatar} alt="Profile" className="profile-card-avatar" /> */}
        <img src={user.image_path || userAvatar} alt="Profile" className="profile-card-avatar" />
        
        <div className="profile-card-info">
          <span className="profile-card-username">{name}</span>
          <span className="profile-card-role">{role}</span>
        </div>
      </div>

      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Update Profile</h3>
            <img src={user.image_path} alt="Profile" className="profile-modal-avatar" />
            <input
              type="text"
              value={user.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="profile-modal-input"
            />
            <div className="profile-modal-actions">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setShowProfileModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showInboxModal && <InboxModal onClose={() => setShowInboxModal(false)} />}
    </div>
  );
};

export default ProfileCard;

