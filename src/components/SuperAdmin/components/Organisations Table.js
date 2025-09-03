import React, { useState, useRef,useEffect } from 'react';
import './OrganisationsTable.css';
import { FaChevronLeft, FaChevronRight, FaFilter, FaStar } from 'react-icons/fa';
import { useOrganizations } from './OrganizationContext';
import LogoModal from './LogoModal';
import axios from 'axios';

const SuperAdminDashboard = () => {
  console.log('SuperAdminDashboard component mounting...');
  
  const { 
    organizations=[], 
    setOrganizations, 
    toggleActive, 
    addLogos, 
    getOrganizationLogos,
    updateLogo,
    getAllLogos,        
    updateTableLogos,   
    removeLogo,         
    setDefaultLogo 
  } = useOrganizations() || [];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log('SuperAdminDashboard render - organizations:', {
    count: organizations.length,
    sample: organizations.length > 0 ? organizations[0] : null
  });
  
  const fileInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [editingLogo, setEditingLogo] = useState(null);
  const editFileInputRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching organizations from API...');
      
      //const response = await axios.get('https://staff-records-backend.onrender.com/api/organizations/');
      const response = await axios.get('https://staged-staff-records-backend.onrender.com/api/organizations/');
      
      console.log('API Response:', {
        status: response.status,
        dataCount: response.data?.length || 0,
        firstItem: response.data?.[0] || null
      });
      
      // Update organizations using context function
      if (setOrganizations) {
        setOrganizations(response.data);
      } else {
        console.warn('setOrganizations not available in context');
      }
      
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Refresh data function
  const handleRefresh = () => {
    console.log('Refreshing organization data...');
    fetchOrganizations();
  };


  console.log('Component state:', {
    currentPage,
    rowsPerPage,
    filterText,
    sortBy,
    editingLogo,
    modalOpen,
    selectedOrganization: selectedOrganization ? selectedOrganization.id : null
  });

  const filteredOrganisations = organizations.filter(org => {
    const searchTerm = filterText.toLowerCase();
    const matches =
      (org.organizationName?.toLowerCase() || '').includes(searchTerm) ||
      (org.domain?.toLowerCase() || '').includes(searchTerm) ||
      (org.subscriptionPlan?.toLowerCase() || '').includes(searchTerm) ||
      (org.organizationNature?.toLowerCase() || '').includes(searchTerm);
    
    console.log(`Filter check for org ${org.id}:`, {
      name: org.organizationName,
      domain: org.domain,
      matches,
      searchTerm
    });
    
    return matches;
  });

  console.log('Filtered organizations:', {
    filterText,
    originalCount: organizations.length,
    filteredCount: filteredOrganisations.length,
    firstFew: filteredOrganisations.slice(0, 3).map(org => org.organizationName)
  });

  const sortedOrganisations = [...filteredOrganisations].sort((a, b) => {
    let aValue, bValue;
    
    console.log(`Sorting comparison between ${a.organizationName} and ${b.organizationName} by ${sortBy}`);
    
    switch(sortBy) {
      case 'name':
        aValue = a.organizationName || '';
        bValue = b.organizationName || '';
        break;
      case 'domain':
        aValue = a.domain || '';
        bValue = b.domain || '';
        break;
      case 'type':
        aValue = a.subscriptionPlan || '';
        bValue = b.subscriptionPlan || '';
        break;
      case 'nature':
        aValue = a.organizationNature || '';
        bValue = b.organizationNature || '';
        break;
      default:
        aValue = a.organizationName || '';
        bValue = b.organizationName || '';
    }
    
    const comparison = {
      aValue,
      bValue,
      result: aValue.toLowerCase() < bValue.toLowerCase() ? -1 : 
              aValue.toLowerCase() > bValue.toLowerCase() ? 1 : 0
    };
    
    console.log('Sort comparison result:', comparison);
    
    return comparison.result;
  });

  console.log('Sorted organizations:', {
    sortBy,
    sortedCount: sortedOrganisations.length,
    firstFew: sortedOrganisations.slice(0, 3).map(org => org.organizationName)
  });
  
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedOrganisations.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedOrganisations.length / rowsPerPage);

  console.log('Pagination info:', {
    currentPage,
    rowsPerPage,
    totalPages,
    indexOfFirstRow,
    indexOfLastRow,
    currentRowsCount: currentRows.length,
    currentRows: currentRows.map(org => org.organizationName)
  });

  // const getDisplayLogos = (orgId) => {
  //   const logos = getOrganizationLogos(orgId);
  //   console.log("logos:: ", logos);
  //   // Safety check
  //   if (!Array.isArray(logos)) {
  //     console.warn(`getOrganizationLogos returned non-array for org ${orgId}:`, logos);
  //     return [{ url: '○', name: 'default', isDefault: true }];
  //   }
    
  //   // Show ALL logos - no slicing/limiting
  //   const displayLogos = logos;
    
  //   console.log(`Getting ALL logos for org ${orgId}:`, {
  //     totalLogos: logos.length,
  //     displayLogos: displayLogos.map(logo => ({
  //       url: logo.url,
  //       isDefault: logo.isDefault,
  //       name: logo.name
  //     }))
  //   });
    
  //   return displayLogos;
  // };

  const getDisplayLogos = (orgId) => {
  const logos = getOrganizationLogos(orgId);
  console.log("raw logos for org", orgId, logos);

  let displayLogos = [];

  // 1️⃣ If it's an object (i.e. a dict of filename → URL), convert it to an array
  if (logos && typeof logos === 'object' && !Array.isArray(logos)) {
    displayLogos = Object.entries(logos).map(([name, url]) => ({
      name,
      url,
      isDefault: false,  // or apply your own logic for default
    }));
    console.log(`Transformed dict to array for org ${orgId}:`, displayLogos);

  // 2️⃣ If it's already an array, assume it's in the right shape
  } else if (Array.isArray(logos)) {
    displayLogos = logos;
    console.log(`Using existing array for org ${orgId}:`, displayLogos);

  // 3️⃣ Otherwise fall back to a placeholder
  } else {
    console.warn(`Unexpected logos format for org ${orgId}:`, logos);
    return [{ url: '○', name: 'default', isDefault: true }];
  }

  // 4️⃣ Return all logos (no slicing/limiting)
  console.log(`Final displayLogos for org ${orgId}:`, displayLogos);
  return displayLogos;
};


  const nextPage = () => {
    console.log('Next page requested. Current page:', currentPage, 'Total pages:', totalPages);
    if (currentPage < totalPages) {
      console.log('Moving to next page:', currentPage + 1);
      setCurrentPage(currentPage + 1);
    } else {
      console.log('Already on last page. No action taken.');
    }
  };

  const prevPage = () => {
    console.log('Previous page requested. Current page:', currentPage);
    if (currentPage > 1) {
      console.log('Moving to previous page:', currentPage - 1);
      setCurrentPage(currentPage - 1);
    } else {
      console.log('Already on first page. No action taken.');
    }
  };

  const goToPage = (page) => {
    console.log('Page navigation requested:', {
      fromPage: currentPage,
      toPage: page,
      valid: page >= 1 && page <= totalPages
    });
    
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      console.warn('Invalid page requested:', page);
    }
  };

  const handleLogoClick = (org) => {
    console.log('Logo container clicked for organization:', {
      id: org.id,
      name: org.organizationName
    });
    setSelectedOrganization(org);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing logo modal for organization:', {
      id: selectedOrganization?.id,
      name: selectedOrganization?.organizationName
    });
    setModalOpen(false);
    setSelectedOrganization(null);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    console.log('Files selected for upload:', {
      filesCount: files.length,
      fileNames: files.map(f => f.name),
      currentOrganization: selectedOrganization?.id
    });
    
    if (files.length && selectedOrganization) {
      console.log('Adding logos to organization:', selectedOrganization.id);
      addLogos(selectedOrganization.id, files);
      event.target.value = null;
    } else {
      console.log('Upload cancelled or no organization selected');
    }
  };

  const handleEditFileChange = (event) => {
    const file = event.target.files[0];
    console.log('Edit file selected:', {
      file: file ? file.name : 'none',
      editingLogo
    });
    
    if (file && editingLogo) {
      console.log('Updating logo:', {
        orgId: editingLogo.orgId,
        logoIndex: editingLogo.logoIndex,
        fileName: file.name
      });
      updateLogo(editingLogo.orgId, editingLogo.logoIndex, file);
      event.target.value = null;
      setEditingLogo(null);
    } else {
      console.log('Edit cancelled or no logo selected for editing');
    }
  };

   if (loading) {
    return (
      <div className="container">
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          fontSize: '18px'
        }}>
          Loading organizations...
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container">
        <div className="error-container" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: '#e74c3c'
        }}>
          <p>Error: {error}</p>
          <button 
            onClick={handleRefresh}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering table with', currentRows.length, 'rows');

  return (
    <div className="container">
      <h1 className="title">Registered Organisations</h1>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />
  
      <input
        type="file"
        ref={editFileInputRef}
        onChange={handleEditFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div className="filter-container">
        <div className="filter-input-wrapper">
          <input
            type="text"
            placeholder="Filter organisations..."
            value={filterText}
            onChange={(e) => {
              console.log('Filter text changed from', filterText, 'to', e.target.value);
              setFilterText(e.target.value);
              setCurrentPage(1); 
            }}
            className="filter-input"
          />
          <FaFilter className="filter-icon" />
        </div>
        <select
          value={sortBy}
          onChange={(e) => {
            console.log('Sort changed from', sortBy, 'to', e.target.value);
            setSortBy(e.target.value);
          }}
          className="sort-select"
        >
          <option value="name">Sort by Name</option>
          <option value="domain">Sort by Domain</option>
          <option value="type">Sort by Subscription Plan</option>
          <option value="nature">Sort by Nature</option>
        </select>
      </div>

      <table className="org-table">
        <thead>
          <tr>
            <th>Organisation Name</th>
            <th>Domain</th>
            <th>Type</th>
            <th>Nature</th>
            <th>Status</th>
            <th>Logos</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((org) => {
              const displayLogos = getDisplayLogos(org.id);
              
              console.log(`Rendering row for org ${org.id}:`, {
                name: org.organizationName,
                active: org.active,
                logosCount: displayLogos.length,
                allLogos: displayLogos.map(logo => ({ url: logo.url, isDefault: logo.isDefault }))
              });
              
              return (
                <tr key={org.id}>
                  <td title={org.organizationName || org.name}>{org.organizationName || org.name}</td>
                  <td title={org.domain}>{org.domain}</td>
                  <td title={org.subscriptionPlan || org.type}>{org.subscriptionPlan || org.type || 'N/A'}</td>
                  <td title={org.organizationNature || org.nature}>{org.organizationNature || org.nature}</td>
                  <td>
                    <span className={`status-badge ${org.active ? 'active' : 'inactive'}`}>
                      {org.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="logos-cell">
                      <div 
                        className="logos-display clickable-logos" 
                        onClick={() => handleLogoClick(org)}
                        title={`Click to manage ${displayLogos.length} logo${displayLogos.length !== 1 ? 's' : ''}`}
                      >
                        {displayLogos.map((logo, index) => (
                          <div 
                            key={`${org.id}-logo-${index}`}
                            className="logo-container"
                          >
                            {logo.url === '○' ? (
                              <div className="logo-placeholder">
                                <span>{logo.url}</span>
                              </div>
                            ) : (
                              <img 
                                src={logo.url} 
                                alt={`${org.organizationName || org.name} logo ${index + 1}`}
                                className="logo-thumbnail"
                                onError={(e) => {
                                  console.error(`Failed to load logo ${index + 1} for org ${org.id}:`, logo.url);
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            {logo.isDefault && (
                              <div className="primary-badge" title="Default logo">
                                <FaStar />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <LogoModal
                        isOpen={modalOpen && selectedOrganization?.id === org.id}
                        onClose={handleCloseModal}
                        organization={selectedOrganization}
                        onAddLogos={addLogos}
                        onUpdateTableLogos={updateTableLogos}
                        onRemoveLogo={removeLogo}
                        onSetDefault={setDefaultLogo}
                        getAllLogos={getAllLogos}
                      />
                    </div>
                  </td>
                  <td>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={org.active}
                        onChange={() => {
                          console.log('Toggling active status for org:', {
                            id: org.id,
                            currentStatus: org.active,
                            newStatus: !org.active
                          });
                          toggleActive(org.id);
                        }}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="no-results">
                {organizations.length === 0 ? 'No organizations found' : 'No matching results'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 0 && (
        <div className="pagination-controls">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`page-number ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
