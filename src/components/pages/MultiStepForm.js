import React, { useState } from 'react';
import { toast } from 'react-toastify';
import BioDataForm from './BioDataForm';
import RoleDataForm from './RoleDataForm';
import CustomDataForm from './CustomDataForm';
import './MultiStepForm.css';

const steps = [
  'Bio-Data',
  'Role',
  'Custom'
];

const MultiStepForm = ({ organizationId, userId, onSubmitSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    bioData: {},
    roleData: {},
    customData: {}
  });

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  // const handleNext = () => {
  //   if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
  // };

  // const handleBack = () => {
  //   if (currentStep > 0) setCurrentStep(prev => prev - 1);
  // };

  // const handleSubmit = () => {
  //   console.log('Submitting New User Data:', formData);
  //   alert('New user created!');
    
  // };

  //  const validateStep = () => {
  //   const key = currentStep === 0 ? 'bioData' : currentStep === 1 ? 'roleData' : 'customData';
  //   return Object.keys(formData[key]).length > 0;
  // };


    // Simple step‐level validation
  const validateStep = () => {
    const key   = ['bioData','roleData','customData'][currentStep];
    const data  = formData[key];
    // Ensure at least one field in this section has been filled
    return Object.values(data).some(v => (v||'').toString().trim() !== '');
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast.error('Please complete all required fields on this step.');
      return;
    }
    setCurrentStep(s => s + 1);
  };



  // const handleNext = () => currentStep < steps.length - 1 && setCurrentStep((prev) => prev + 1);
  const handleBack = () => currentStep > 0 && setCurrentStep((prev) => prev - 1);
  
  
  // const handleSubmit = () => {
  //   console.log('Submitting New User Data:', formData);
  //   alert('New user created!');
  // };

  // Final submit enforces the 5 tenant‐mandated slots
  const handleSubmit = () => {
    // 1) Basic step validation
    if (!validateStep()) {
      toast.error('Please complete all required fields on this step.');
      return;
    }

    // 2) Build combined payload
    const payload = {
      ...formData.bioData,
      ...formData.roleData,
      ...formData.customData,
      organizationId,
      userId,
    };

    // 3) Enforce those five semantic fields, no matter what labels they chose:
    //    - First Name: bioData.firstName or bioData.givenName
    //    - Middle Name: bioData.middleName
    //    - Last Name: bioData.lastName or bioData.familyName/surname
    //    - Email: bioData.email
    //    - Role: roleData.role (or however your RoleDataForm passes it)
    const missing = [];
    if (!payload.firstName && !payload.givenName) missing.push('First Name');
    if (!payload.middleName)                   missing.push('Middle Name');
    if (!payload.lastName && !payload.familyName && !payload.surname)
      missing.push('Last Name');
    if (!payload.email)                        missing.push('Email');
    if (!payload.role)                         missing.push('Role');

    if (missing.length) {
      toast.error(`Missing required fields: ${missing.join(', ')}`);
      return;
    }

    // 4) All good! Call back up to the modal
    onSubmitSuccess(payload);
  };
 



  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BioDataForm
            data={formData.bioData}
            updateData={(data) => updateFormData('bioData', data)}
          />
        );
      case 1:
        return (
          <RoleDataForm
            data={formData.roleData}
            updateData={(data) => updateFormData('roleData', data)}
          />
        );
      case 2:
        return (
          <CustomDataForm
            data={formData.customData}
            updateData={(data) => updateFormData('customData', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="multi-step-form">
      <h2>{steps[currentStep]}</h2>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
      </div>
      <form onSubmit={e => e.preventDefault()}>
        {renderStep()}
        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button type="button" onClick={handleBack}>Back</button>
          )}
          {currentStep < steps.length - 1 && (
            <button type="button" onClick={handleNext} disabled={!validateStep()}>
              Next
            </button>
          )}
          {currentStep === steps.length - 1 && (
            <button type="button" onClick={handleSubmit} disabled={!validateStep()}>
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
