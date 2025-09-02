// src/components/BioDataSection.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './BioDataSection.css';
import request from "../request"; // Adjust the import based on your project structure

// Enum options defined as per your backend enums:
const TITLE_OPTIONS = [
  'Prof.', 'PhD', 'Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Esq.', 'Hon.', 'Rev.', 'Msgr.', 'Sr.', 'Other'
];
const GENDER_OPTIONS = [
  'Male', 'Female', 'Other'
];
const MARITAL_STATUS_OPTIONS = [
  'Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Other'
];

const BioDataSection = ({ staffData, pending, onRequestChange  }) => {
  const [editing, setEditing] = useState(false);
  // Local state to hold the fetched bio-data.
  const [bioData, setBioData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    title: '',
    gender: '',
    date_of_birth: '',
    marital_status: '',
    email: '',
    contact_info: {},
    hire_date: '',
    termination_date: '',
    profile_image_path: ''
  });
  const [dob, setDob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    // Set the initial state with the passed staffData prop
    if (staffData) {
      setBioData(staffData);
      if (staffData.date_of_birth) {
        setDob(new Date(staffData.date_of_birth));
      }
    } else {
      setError("No staff data provided.");
    }
    setLoading(false);
  }, [staffData]);

  // Handle text input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBioData(prev => ({ ...prev, [name]: value }));
  };

  // Handle dropdown change.
  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setBioData(prev => ({ ...prev, [name]: value }));
  };

  // Handle date change.
  const handleDateChange = (date) => {
    setDob(date);
    // Update in ISO string format (YYYY-MM-DD)
    setBioData(prev => ({ ...prev, date_of_birth: date.toISOString().split('T')[0] }));
  };

   // Replace local save with onRequestChange
   const handleSave = () => {
    onRequestChange({
      data: bioData,
      requestType: editing ? 'update' : 'save',
      dataType: 'employees'
    });
    setEditing(true);
  };

  if (loading) return <p>Loading bio-data...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="bio-data-section">
      {pending && (
        <div className="pending-banner">
          ⚠️ Your Bio-Data changes are pending approval
        </div>
      )}
      <div className="form-group">
      <label>Title</label>
        <select
          name="title"
          value={bioData.title}
          onChange={handleDropdownChange}
        >
          {TITLE_OPTIONS.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        </div>

      <div className="form-group">

        <label>First Name</label>
        <input
          type="text"
          name="first_name"
          value={bioData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          readOnly={!editing}
        />
      </div>
      <div className="form-group">
        <label>Middle Name</label>
        <input
          type="text"
          name="middle_name"
          value={bioData.middle_name}
          onChange={handleChange}
          placeholder="Middle Name"
        />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="last_name"
          value={bioData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          readOnly={!editing}
        />
      </div>
    
      <div className="form-group">
        <label>Gender</label>
        <select
          name="gender"
          value={bioData.gender}
          onChange={handleDropdownChange}
        >
          {GENDER_OPTIONS.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Date of Birth</label>
        <DatePicker 
          selected={dob} 
          onChange={handleDateChange} 
          dateFormat="dd-MM-yyyy" 
          placeholderText="Select date" 
        />
      </div>
      <div className="form-group">
        <label>Marital Status</label>
        <select
          name="marital_status"
          value={bioData.marital_status}
          onChange={handleDropdownChange}
        >
          {MARITAL_STATUS_OPTIONS.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={bioData.email}
          onChange={handleChange}
          placeholder="Email"
        />
      </div>
      <div className="form-group">
        <label>Contact Information</label>
        <textarea
          name="contact_info"
          value={typeof bioData.contact_info === 'object' ? JSON.stringify(bioData.contact_info) : bioData.contact_info}
          onChange={handleChange}
          placeholder="Contact Information (in JSON format if applicable)"
        />
      </div>

      <div className="section-actions">
        <button onClick={handleSave}>Save</button>
        {/* <button onClick={handleProposeUpdate}>Propose Update</button> */}
      </div>
    </div>
  );
};

export default BioDataSection;

