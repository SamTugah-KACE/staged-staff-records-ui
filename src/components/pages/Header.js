// src/pages/Header.js
import React from 'react';
import './Header.css';
import { useOrganization } from '../../context/OrganizationContext';

const Header = () => {
  const { organization } = useOrganization();

  // Use let so we can assign values conditionally.
  let leftLogo = null;
  let rightLogo = null;
  if (organization && organization.logos) {
    // Convert logos dictionary to an array of encoded URLs.
    const logos = Object.values(organization.logos).map(url => encodeURI(url));
    // const logos = org?.logos ? Object.values(org.logos).map(url => encodeURI(url)) : [];
    leftLogo = logos[0] || null;
    rightLogo = logos[1] || null;
  }
  const organizationName = organization?.name || "Your Organization";

  return (
    <header className="dashboard-header">
      {leftLogo && (
        <img src={leftLogo} alt="Left Logo" className="header-logo left-logo" />
      )}
      <h1 className="org-name">{organizationName}</h1>
      {rightLogo && (
        <img src={rightLogo} alt="Right Logo" className="header-logo right-logo" />
      )}
    </header>
  );
};

export default Header;
