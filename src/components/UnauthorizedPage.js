// src/components/UnauthorizedPage.js
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UnauthorizedPage = ({ message }) => {
  const navigate = useNavigate();
  const { orgSlug } = useParams();

  const handleSignIn = () => {
    // If orgSlug exists, redirect to tenant-specific sign in
    if (orgSlug) {
      navigate(`/${orgSlug}/signin`);
    } else {
      navigate('/signin');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8f9fa', color: '#343a40' }}>
      <h1>Access Denied</h1>
      <div>
        {message ||
          "You are not authorized to view this page. Please sign in to continue."}
      </div>
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
        onClick={handleSignIn}
      >
        Sign In
      </button>
    </div>
  );
};

export default UnauthorizedPage;
