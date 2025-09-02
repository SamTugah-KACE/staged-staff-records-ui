// src/context/OrganizationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context.
const OrganizationContext = createContext();

// Provider component.
export const OrganizationProvider = ({ children }) => {
  const [organization, setOrganization] = useState(null);

  // On mount, try to load from localStorage
  useEffect(() => {
    const storedOrg = localStorage.getItem('orgData');
    if (storedOrg) {
      try {
        setOrganization(JSON.parse(storedOrg));
        // setOrganization(storedOrg);
        console.log("Organization loaded from storage:", JSON.parse(storedOrg));
      } catch (error) {
        console.error("Error parsing orgData from localStorage:", error);
      }
    }
  }, []);

  // Function to set organization data.
  const setOrgData = (orgData) => {
    setOrganization(orgData);
    console.log("setOrgData in context: ", organization);
    // Optionally store in localStorage for persistence across sessions.
    localStorage.setItem('orgData', JSON.stringify(orgData));
  };

  // Function to clear organization data.
  const clearOrgData = () => {
    setOrganization(null);
    localStorage.removeItem('orgData');
  };

  return (
    <OrganizationContext.Provider value={{ organization, setOrgData, clearOrgData }}>
      {children}
    </OrganizationContext.Provider>
  );
};

// Custom hook to easily access the context.
export const useOrganization = () => useContext(OrganizationContext);
