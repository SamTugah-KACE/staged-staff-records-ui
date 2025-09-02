// src/components/staff/EmploymentDetailsForm.js
import React, { useState } from 'react';
import './EmploymentDetailsForm.css';

const EmploymentDetailsForm = ({ initialValues, onFinish, onCancel }) => {
  const [formData, setFormData] = useState({
    branch: initialValues?.branch || '',
    department: initialValues?.department || '',
    rank: initialValues?.rank || ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch is required';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.rank.trim()) {
      newErrors.rank = 'Rank is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onFinish(formData);
    }
  };
  
  const departments = ['Engineering', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations'];
  const ranks = ['Intern', 'Junior', 'Associate', 'Senior', 'Manager', 'Director', 'VP', 'C-Suite'];
  const branches = ['Main Branch', 'North Branch', 'South Branch', 'East Branch', 'West Branch'];
  
  return (
    <div className="employment-details-form">
      <h3>Edit Employment Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="branch">Branch</label>
          <select
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className={errors.branch ? 'error' : ''}
          >
            <option value="">Select Branch</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          {errors.branch && <span className="error-message">{errors.branch}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={errors.department ? 'error' : ''}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <span className="error-message">{errors.department}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="rank">Rank</label>
          <select
            id="rank"
            name="rank"
            value={formData.rank}
            onChange={handleChange}
            className={errors.rank ? 'error' : ''}
          >
            <option value="">Select Rank</option>
            {ranks.map(rank => (
              <option key={rank} value={rank}>{rank}</option>
            ))}
          </select>
          {errors.rank && <span className="error-message">{errors.rank}</span>}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">Save</button>
          <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EmploymentDetailsForm;