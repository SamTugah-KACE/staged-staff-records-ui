import React, { useState } from 'react';
import './ProfileDropdown.css';
import userAvatar from '../../assets/images/avatar.jpeg';

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState({ username: 'John Doe', avatar: userAvatar });

  const toggleDropdown = () => setOpen(!open);
  const closeDropdown = () => setOpen(false);

  const handleProfileUpdate = () => {
    // In production, open file picker and update profile image via API
    alert('Profile image updated!');
    setShowProfileModal(false);
  };

  return (
    <div className="profile-dropdown">
      <button className="profile-dropdown-btn" onClick={toggleDropdown}>
        <img src={profile.avatar} alt="User" className="profile-avatar" />
      </button>
      <div className={`profile-dropdown-menu ${open ? 'active' : ''}`}>
        <div className="menu-item" onClick={() => { setShowProfileModal(true); closeDropdown(); }}>
          Profile
        </div>
        <div className="menu-item" onClick={() => { alert('Reset Password clicked'); closeDropdown(); }}>
          Reset Password
        </div>
        <div className="menu-item" onClick={() => { alert('Logout clicked'); closeDropdown(); }}>
          Logout
        </div>
      </div>
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <img src={profile.avatar} alt="User" className="profile-modal-avatar" />
            <input
              type="text"
              defaultValue={profile.username}
              className="profile-modal-input"
              onBlur={(e) => setProfile({...profile, username: e.target.value})}
            />
            <div className="profile-modal-actions">
              <button onClick={handleProfileUpdate}>Update</button>
              <button onClick={() => setShowProfileModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

// const ProfileDropdown = () => {
//   const [open, setOpen] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);

//   const toggleDropdown = () => setOpen(!open);
//   const closeDropdown = () => setOpen(false);

//   return (
//     <div className="profile-dropdown">
//       <button className="profile-dropdown-btn" onClick={toggleDropdown}>
//         <img src={userAvatar} alt="User" />
//       </button>
//       <div className={`profile-dropdown-menu ${open ? 'active' : ''}`}>
//         <div className="menu-item" onClick={() => { setShowProfileModal(true); closeDropdown(); }}>Profile</div>
//         <div className="menu-item" onClick={() => { alert('Reset Password clicked'); closeDropdown(); }}>Reset Password</div>
//         <div className="menu-item" onClick={() => { alert('Logout clicked'); closeDropdown(); }}>Logout</div>
//       </div>
//       {showProfileModal && (
//         <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
//           <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
//             <img src={userAvatar} alt="User" className="profile-modal-avatar" />
//             <input type="text" defaultValue="John Doe" className="profile-modal-input" />
//             <div className="profile-modal-actions">
//               <button onClick={() => alert('Profile updated!')}>Update</button>
//               <button onClick={() => setShowProfileModal(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileDropdown;
