// src/components/BranchModal.js
import React, { useState } from 'react';
import request from '../components/request';
import { useOrganization } from '../context/OrganizationContext';

const BranchModal = ({ onClose, onBranchCreated }) => {
  const { organization } = useOrganization();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location)  return;
    setLoading(true);
    console.log("\n\norganization name & ID: ","Name: "+`${organization.id}`+"\nID: "`${organization.id}`);
    try {
      const response = await request.post(`/organizations/${organization.id}/branches`, { name, location });
      onBranchCreated(response.data);
      onClose();
    } catch (error) {
      alert("Error creating branch: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New Branch</h3>
        <form onSubmit={handleSubmit}>
          <label>Branch Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
          <div className="modal-actions">
            <button type="submit" disabled={loading}>Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchModal;
