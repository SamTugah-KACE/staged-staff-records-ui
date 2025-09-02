import React, { createContext, useState, useContext } from 'react';

const initialOrganizations = [
  {
    id: 'ORG001',
    organizationName: 'Tech Solutions Inc',
    domain: 'https://techsolutions.com',
    subscriptionPlan: 'Premium',
    organizationNature: 'private',
    employeeRange: 50,
    contactPerson: 'John Doe',
    contactEmail: 'john@techsolutions.com',
    phoneNumber: '+1234567890',
    logos: [{ url: '○', name: 'default', isDefault: true }],
    allLogos: [{ url: '○', name: 'default', isDefault: true, id: 'default-' + Math.random() }],
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ORG002',
    organizationName: 'Green Energy Ltd',
    domain: 'https://greenenergy.org',
    subscriptionPlan: 'Basic',
    organizationNature: 'NGO',
    employeeRange: 25,
    contactPerson: 'Jane Smith',
    contactEmail: 'jane@greenenergy.org',
    phoneNumber: '+0987654321',
    logos: [{ url: '○', name: 'default', isDefault: true }],
    allLogos: [{ url: '○', name: 'default', isDefault: true, id: 'default-' + Math.random() }],
    active: false,
    createdAt: new Date().toISOString()
  },
];



const OrganizationContext = createContext();

export const useOrganizations = () => useContext(OrganizationContext);

export const OrganizationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState([]);
  
  // Function to set organizations from API data
  const setOrganizationsFromAPI = (apiData) => {
    console.log('Setting organizations from API:', apiData);
    
    // Transform API data to match your internal structure
    const transformedData = apiData.map(org => ({
      // Map API fields to your internal structure
      id: org.id,
      // organizationName:  org.name,
      name:  org.name,
      organizationEmail: org.org_email,
      domain: org.domain,
      // organizationNature: org.organizationNature || org.nature,
      nature: org.nature,
      type: org.type ,
      employeeRange: org.employee_range,
      subscriptionPlan: org.subscription_plan,
      contactPerson: org.contactPerson,
      contactEmail: org.contactEmail,
      phoneNumber: org.phoneNumber,
      // Initialize logos if not provided
      logos: org.logos || [{ url: '○', name: 'default', isDefault: true }],
      // allLogos: org.allLogos || [{ url: '○', name: 'default', isDefault: true, id: 'default-' + Math.random() }],
      active: org.is_active !== undefined ? org.is_active : true,
      createdAt: org.createdAt || new Date().toISOString()
    }));
    
    setOrganizations(transformedData);
  };
  
  const addOrganization = (formData) => {
  console.log('addOrganization called with:', formData);
  console.log('logoFiles:', formData.logoFiles);

  const newId = `ORG${String(organizations.length + 1).padStart(3, '0')}`;

  let logoObjects = [];

  if (formData.logoFiles && formData.logoFiles.length > 0) {
    logoObjects = formData.logoFiles.map((fileData, index) => {
      const file = fileData.file || fileData;
      return {
        url: URL.createObjectURL(file),
        name: fileData.name || file.name,
        size: fileData.size || file.size,
        type: fileData.type || file.type,
        file: file,
        isDefault: index === 0, 
        id: Date.now() + Math.random() + index
      };
    });
  }

  if (logoObjects.length === 0) {
     logoObjects.push({ url: '○', name: 'placeholder', isDefault: true });
   }
    
    const newOrganization = {
      id: newId,
      organizationName: formData.organizationName,
      name: formData.organizationName, 
      organizationEmail: formData.organizationEmail,
      domain: formData.domain,
      organizationNature: formData.organizationNature,
      nature: formData.organizationNature, 
      type: formData.subscriptionPlan || 'Free', 
      employeeRange: formData.employeeRange,
      subscriptionPlan: formData.subscriptionPlan || 'Free',
      contactPerson: formData.contactPerson,
      contactEmail: formData.contactEmail,
      phoneNumber: formData.phoneNumber,
      logos: logoObjects,
      allLogos: [...logoObjects],
      active: true,
      createdAt: new Date().toISOString()
    };
    
    setOrganizations(prev => [...prev, newOrganization]);
    return newId;
  };
  
  const toggleActive = (id) => {
    setOrganizations(
      organizations.map((org) =>
        org.id === id ? { ...org, active: !org.active } : org
      )
    );
  };

  const getAllLogos = (id) => {
    const org = organizations.find(org => org.id === id);
    return org?.logos || [];
  };

  const updateTableLogos = (id, selectedLogos) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === id) {
          return { ...org, logos: selectedLogos };
        }
        return org;
      })
    );
  };               

  const addLogos = (id, newLogoFiles) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === id) {
          const newLogoObjects = newLogoFiles.map((file, index) => ({
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
            file: file,
            isDefault: false,
            id: Date.now() + Math.random() + index
          }));

          return {
            ...org,
            allLogos: [...(org.allLogos || []), ...newLogoObjects]
          };
        }
        return org;
      })
    );
  };

  const updateLogo = (id, logoIndex, newFile) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === id) {
          const updatedLogos = [...org.logos];
          
          if (updatedLogos[logoIndex] && updatedLogos[logoIndex].url && updatedLogos[logoIndex].url.startsWith('blob:')) {
            URL.revokeObjectURL(updatedLogos[logoIndex].url);
          }
          
          updatedLogos[logoIndex] = {
            url: URL.createObjectURL(newFile),
            name: newFile.name,
            size: newFile.size,
            type: newFile.type,
            file: newFile,
            isDefault: updatedLogos[logoIndex]?.isDefault || false
          };
          
          return { ...org, logos: updatedLogos };
        }
        return org;
      })
    );
  };

  const removeLogo = (id, logoId) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === id) {
          const logoToRemove = org.allLogos.find(logo => logo.id === logoId);
          
          if (logoToRemove && logoToRemove.url && logoToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(logoToRemove.url);
          }
          
          const updatedAllLogos = org.allLogos.filter(logo => logo.id !== logoId);
          const updatedTableLogos = org.logos.filter(logo => logo.id !== logoId);
          
          if (updatedTableLogos.length === 0) {
            updatedTableLogos.push({ url: '○', name: 'placeholder', isDefault: true });
          }
          
          return { 
            ...org, 
            allLogos: updatedAllLogos,
            logos: updatedTableLogos
          };
        }
        return org;
      })
    );
  };

  const setDefaultLogo = (id, logoId) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === id) {
          const updatedAllLogos = org.allLogos.map(logo => ({
            ...logo,
            isDefault: logo.id === logoId
          }));
          
          const updatedTableLogos = org.logos.map(logo => ({
            ...logo,
            isDefault: logo.id === logoId
          }));
          
          return { 
            ...org, 
            allLogos: updatedAllLogos,
            logos: updatedTableLogos
          };
        }
        return org;
      })
    );
  };

  const getOrganizationLogos = (id) => {
    const org = organizations.find(org => org.id === id);
    return org?.logos || [{ url: '○', name: 'default', isDefault: true }];
  };
  
  const value = {
    organizations,
    setOrganizations: setOrganizationsFromAPI, 
    addOrganization,
    toggleActive,
    addLogos,
    removeLogo,
    setDefaultLogo,
    getOrganizationLogos,
    updateLogo,
    getAllLogos,
    updateTableLogos
  };
  
  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContext;