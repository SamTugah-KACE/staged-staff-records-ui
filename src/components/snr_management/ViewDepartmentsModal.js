// src/components/ViewDepartmentsModal.js
import React, { useEffect, useState } from 'react';
import './ViewDepartmentsModal.css';
import request from '../request';
import { useOrganization } from '../../context/OrganizationContext';
import DepartmentRow from './DepartmentRow';

const ViewDepartmentsModal = ({ onClose }) => {
  const { organization } = useOrganization();
  const organizationId = organization?.id;
  const isBranchManaged = organization?.nature?.toLowerCase().includes('branch');

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  // Fetch departments when component mounts or skip changes
  useEffect(() => {
    if (!organizationId) return;
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await request.get(
          `/organizations/${organizationId}/departments?skip=${skip}&limit=${limit}`
        );
        setDepartments(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch departments.');
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, [organizationId, skip]);

  const handleNext = () => {
    if (departments.length === limit) {
      setSkip(skip + limit);
    }
  };

  const handlePrev = () => {
    if (skip >= limit) {
      setSkip(skip - limit);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content view-dept-modal">
        <h3>Departments</h3>
        {loading ? (
          <div className="spinner"></div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <table className="dept-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Head of Department</th>
                {isBranchManaged && <th>Branch</th>}
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <DepartmentRow
                    key={dept.id}
                    department={dept}
                    organizationId={organizationId}
                    isBranchManaged={isBranchManaged}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={isBranchManaged ? 3 : 2}>No departments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <div className="pagination">
          <button onClick={handlePrev} disabled={skip === 0}>
            Previous
          </button>
          <button onClick={handleNext} disabled={departments.length < limit}>
            Next
          </button>
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewDepartmentsModal;
