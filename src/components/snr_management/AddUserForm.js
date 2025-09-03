

// src/components/AddUserForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './AddUserForm.css';
import request from '../request';
import { toast } from 'react-toastify';
import AddRoleModal from './AddRoleModal';
import { mapEmployeeFields } from '../utils/mappingUtil';
import CompiledFormRenderer from './CompiledFormRenderer';


/**
 * Helper function to split an array into chunks.
 */
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Custom hook to fetch and cache department options.
 */
const useDepartments = (organizationId) => {
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await request.get(
          `/organizations/${organizationId}/departments?skip=0&limit=100`
        );
        const data = res.data;
        if (Array.isArray(data)) {
          setDepartments(data);
        } else if (data.departments) {
          setDepartments(data.departments);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, [organizationId]);
  return departments;
};



/**
 * Normalizes a key: lowercases it, trims spaces, and removes punctuation.
 */
const normalizeKey = (key) => {
  return key.trim().toLowerCase().replace(/[^\w\s]/g, "");
};


/**
 * Merges contact-related fields into the "contact_info" key.
 */
const mergeContactInfoFields = (data) => {
  const contactInfo = data.contact_info && typeof data.contact_info === "object" 
        ? { ...data.contact_info } : {};
  const keysToMerge = Object.keys(data).filter(k => {
    const norm = normalizeKey(k);
    return (norm.includes("phone") || norm.includes("address")) && !norm.includes("next of kin");
  });
  keysToMerge.forEach(k => {
    contactInfo[k] = data[k];
    delete data[k];
  });
  data.contact_info = contactInfo;
  return data;
};

/**
 * Renders a field based on its type.
 * – For fields whose label contains "department" (case-insensitive), renders a dynamic dropdown.
 * – For radio and checkbox fields, renders horizontal layout if ≤3 options; otherwise wraps.
 * – For role_select fields, if roles are loading, shows a loading message.
 * – The submit field is not rendered.
 */
const renderField = (
  field,
  fieldValue,
  handleChange,
  organizationId,
  roleOptions,
  departments,
  openAddRole,
  isRolesLoading
) => {
  if (/department/i.test(field.label)) {
    return (
      <select name={field.label} value={fieldValue || ""} onChange={handleChange}>
        <option value="">Select a Department</option>
        {departments.map(dep => (
          <option key={dep.id} value={dep.id}>
            {dep.name}
          </option>
        ))}
      </select>
    );
  }
  switch (field.id) {
    case 'radio': {
      if (field.options?.choices && field.options.choices.length > 0) {
        const layoutClass = field.options.choices.length <= 3 ? 'options-horizontal' : 'options-group';
        return (
          <div className={layoutClass}>
            {field.options.choices.map((choice, idx) => (
              <label key={idx} className="option-label">
                <input
                  type="radio"
                  name={field.label}
                  value={choice}
                  checked={fieldValue === choice}
                  onChange={handleChange}
                />
                {choice}
              </label>
            ))}
          </div>
        );
      }
      return <span className="no-options">No options available</span>;
    }
    case 'checkbox': {
      if (field.options?.choices && field.options.choices.length > 0) {
        const values = Array.isArray(fieldValue) ? fieldValue : [];
        const layoutClass = field.options.choices.length <= 3 ? 'options-horizontal' : 'options-group';
        return (
          <div className={layoutClass}>
            {field.options.choices.map((choice, idx) => (
              <label key={idx} className="option-label">
                <input
                  type="checkbox"
                  name={field.label}
                  value={choice}
                  checked={values.includes(choice)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newValues = [...values];
                    if (checked) newValues.push(choice);
                    else newValues = newValues.filter(v => v !== choice);
                    handleChange({
                      target: { name: field.label, value: newValues, type: 'checkbox' },
                    });
                  }}
                />
                {choice}
              </label>
            ))}
          </div>
        );
      }
      return <span className="no-options">No options available</span>;
    }
    case 'select':
    case 'role_select': {
      if (field.id === 'role_select' && isRolesLoading) {
        return <span>Loading roles…</span>;
      }
      const options =
        field.id === 'role_select'
          ? roleOptions || []
          : (field.options?.choices || []).map(choice => ({ id: choice, name: choice }));
      return (
        <select
          name={field.label}
          value={fieldValue || ""}
          onChange={(e) => {
            const selected = e.target.value;
            if (field.id === 'role_select' && selected === '__add_new_role__') {
              openAddRole();
            } else {
              handleChange(e);
            }
          }}
        >
          <option value="">Select an option</option>
          {options.map((option, idx) => (
            <option key={option.id || idx} value={option.id || option.name}>
              {option.name !== undefined ? option.name : option}
            </option>
          ))}
          {/* {field.id === 'role_select' && (
            <option value="__add_new_role__">Add New Role</option>
          )} */}
        </select>
      );
    }
    case 'file': {
      return (
        <input type="file" name={field.label} multiple onChange={handleChange} />
      );
    }
    case 'submit': {
     return (
      <button type="submit" className="submit-button">
        Add New User
      </button>
     );
      // Do not render any submit control from design. The modal actions handle submission.
      // return null;
    }
    default: {
      return (
        <input
          type={field.id === 'number' ? 'number' : field.id}
          name={field.label}
          placeholder={field.label}
          value={fieldValue || ''}
          onChange={handleChange}
        />
      );
    }
  }
};

const AddUserForm = ({ organizationId, userId, onClose, onUserAdded }) => {
  const [formDesign, setFormDesign] = useState(null);
  // Use field labels as keys for independent control.
  const [fieldValues, setFieldValues] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const departments = useDepartments(organizationId);
  const [isLoading, setIsLoading] = useState(true);
  const [isRolesLoading, setIsRolesLoading] = useState(true);

  // --- WebSocket: Fetch precompiled form design ---
  useEffect(() => {
    const wsUrl = `wss://staged-staff-records-backend.onrender.com/ws/form-design/${organizationId}/${userId}`;
    const ws = new WebSocket(wsUrl);
    let timeoutId = setTimeout(() => {
      toast.error("Form design load timeout. Please try again later.");
      setIsLoading(false);
    }, 10000); // 10-second timeout
    ws.onopen = () => console.info("WebSocket connected to form-design endpoint.");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setFormDesign(data.formDesign);
        
        // Check if this is a compiled form (has html, css, js properties)
        const isCompiledForm = data.formDesign?.html && data.formDesign?.css && data.formDesign?.js;
        
        if (isCompiledForm) {
          console.log("Compiled form detected:", data.formDesign);
          // For compiled forms, we don't need to set up the traditional form state
          // The CompiledFormRenderer will handle everything
        } else if (data.formDesign?.fields && data.formDesign.fields.length > 0) {
          // Traditional form setup for non-compiled forms
          const initValues = {};
          data.formDesign.fields.forEach((field) => {
            // Use field.label as the unique key; for checkboxes initialize as an array.
            initValues[field.label] = field.id === 'checkbox' ? [] : '';
          });
          setFieldValues(initValues);
          if (data.formDesign.fields.length > 4) {
            setSteps(chunkArray(data.formDesign.fields, 4));
            setCurrentStep(0);
          } else {
            setSteps([data.formDesign.fields]);
          }
        }
      } catch (error) {
        console.error("Error parsing form design:", error);
      } finally {
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setFormDesign({ fields: [] });
      setIsLoading(false);
      clearTimeout(timeoutId);
    };
    ws.onclose = () => {
      console.info("WebSocket closed.");
      setIsLoading(false);
      clearTimeout(timeoutId);
    };
    return () => {
      clearTimeout(timeoutId);
      ws.close();
    };
  }, [organizationId, userId]);

  // --- Fetch role options ---
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await request.get(`/fetch?organization_id=${organizationId}&skip=0&limit=100`);
        const data = res.data;
        if (data) {
          setRoleOptions(data);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsRolesLoading(false);
      }
    };
    fetchRoles();
  }, [organizationId]);

  // Controlled input handler.
  const handleInputChange = useCallback((e) => {
    const { name, value, type } = e.target;
    const newVal = type === 'file' ? e.target.files : value;
    setFieldValues((prev) => ({ ...prev, [name]: newVal }));
  }, []);

  const openAddRole = () => {
    setShowAddRoleModal(true);
  };

    // Validate individual step (non-empty)
  const validateStep = () => {
    const fields = steps[currentStep];
    return fields.every(fld => {
      const val = fieldValues[fld.label];
      if (fld.required) {
        if (fld.id === 'file') return val?.length > 0;
        return val !== undefined && val.toString().trim() !== '';
      }
      return true;
    });
  };

  // --- Submission: Map field keys using helper functions and build payload. ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    //  if (!validateStep()) {
    //   toast.error('Please fill all required fields on this page.');
    //   return;
    // }
    if (!formDesign || !formDesign.fields || formDesign.fields.length === 0) {
      toast.info("No form design available. Please contact your administrator.");
      return;
    }
    console.log("Field Values: ", fieldValues);
    console.log("Form Design: ", formDesign);
    console.log("Organization ID: ", organizationId);
    console.log("User ID: ", userId);
    console.log("\n\n\nsubmitUrl: ", formDesign.submitUrl);
    try {
      let response;
      // First, map the dynamic keys (field labels) to canonical keys.
      const mappedData = mapEmployeeFields(fieldValues);
      const payloadData = mergeContactInfoFields(mappedData);
      payloadData.organization_id = organizationId;

      // Merge any contact-related fields into a unified object.
    // payloadData = { organization_id: organizationId, ...mappedData };
      console.log("Mapped Payload Data: ", payloadData);
      // Remove any unwanted fields from the payload.
      // For example, if the form design has a submit field, remove it from the payload.
      //if payloadData has Submit Button as part of the payload to be sent to the server, remove it.


      // if (payloadData.submit || payloadData["Submit Button"]) {
        delete payloadData.submit;
        delete payloadData['Submit Button'];
      // }
      console.log("Payload Data: ", payloadData);

      // Use FormData if there is a file field.
      const hasFileField = formDesign.fields.some(field => field.id === 'file');
      if (hasFileField) {
        const formData = new FormData();
        Object.entries(payloadData).forEach(([key, val]) => {
          if (val instanceof FileList) {
            Array.from(val).forEach(file => formData.append(key, file));
          } else {
            formData.append(key, val);
          }
        });


         // ** Tenant-mandated fields enforcement **
    //  - first name: any label matching /(first|given)/i
    //  - middle name: /middle/i
    //  - last name: /(last|surname|family)/i
    //  - email: fld.id==='email'
    //  - role: fld.id==='role_select'
    const fldInfo = formDesign.fields.map(f => ({
      id: f.id,
      label: f.label,
      norm: f.label.toLowerCase()
    }));

    console.log("fldInfo:: ", fldInfo);

    // const missing = [];
    // if (!fldInfo.some(f => /(first|given)/i.test(f.norm) && payloadData[f.label]?.toString().trim()))
    //   missing.push('First Name');
    // if (!fldInfo.some(f => /middle/i.test(f.norm) && payloadData[f.label]?.toString().trim()))
    //   missing.push('Middle Name');
    // if (!fldInfo.some(f => /(last|surname|family)/i.test(f.norm) && payloadData[f.label]?.toString().trim()))
    //   missing.push('Last Name');
    // if (!fldInfo.some(f => f.id === 'email' && payloadData[f.label]?.toString().trim()))
    //   missing.push('Email');
    // if (!fldInfo.some(f => f.id === 'role_select' && payloadData[f.label]?.toString().trim()))
    //   missing.push('Role');

    // if (missing.length) {
    //   toast.error(`Missing required fields: ${missing.join(', ')}`);
    //   return;
    // }

        formData.append('organization_id', organizationId);
        response = await request.post('/users/create', formData);
      } else {
        // const payload = { organization_id: organizationId };
        // Object.entries(payloadData).forEach(([label, value]) => {
        //   payload[label] = value;
        // });
        // response = await request.post(formDesign.submitUrl || '/users/create', JSON.stringify(payloadData));
        response = await request.post('/users/create', JSON.stringify(payloadData));
      }
      if ( ![200, 201].includes(response.status)) {
        const errorData = response.data;
        throw new Error(errorData.detail || 'Submission failed');
      }
      // If the form design has embedded submit code, execute it.
      // if (formDesign && formDesign.s ubmitCode) {
      //   try {
      //     const submitFunc = new Function(`"use strict"; return (${formDesign.submitCode})`)();
      //     await submitFunc(fieldValues);
      //   } catch (error) {
      //     console.error("Submission error from submitCode:", error);
      //     toast.error(`Error executing submit code: ${error.message}`);
      //   }
      // }
      onUserAdded();
      onClose();
    } catch (error) {
      console.error("Submit Form Error:", error);
      toast.error(`${error.message}`);
    }
  };

  const nextStep = () => validateStep() && setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const renderFields = () => {
    const fieldsToRender = steps[currentStep];
    return fieldsToRender.map((field, index) => {
      const key = `${currentStep}-${field.id}-${index}`;
      return (
        <div key={key} className="form-group">
          <label>{field.label}</label>
          {renderField(
            field,
            fieldValues[field.label],
            handleInputChange,
            organizationId,
            roleOptions,
            departments,
            openAddRole,
            isRolesLoading
          )}
        </div>
      );
    });
  };

  if (isLoading || isRolesLoading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Loading form…</p>
          {/* Replace with a spinner graphic if desired */}
        </div>
      </div>
    );
  }
  
  if (!formDesign || (!formDesign.fields && !formDesign.html)) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>No form design available. Please contact your administrator.</p>
           <div className="modal-footer">
          <button onClick={onClose} className="footer-btn close-btn">
            Close
          </button>
        </div>
        </div>
       
      </div>
    );
  }

  // Check if this is a compiled form (has html, css, js properties)
  const isCompiledForm = formDesign?.html && formDesign?.css && formDesign?.js;
  
  if (isCompiledForm) {
    return (
      <CompiledFormRenderer
        formDesign={formDesign}
        organizationId={organizationId}
        onClose={onClose}
        onUserAdded={onUserAdded}
        roleOptions={roleOptions}
        departments={departments}
      />
    );
  }

  // Check if the precompiled design already contains a submit field.
  const hasSubmitField = formDesign.fields.some(f => f.id === 'submit');
  console.log("hasSubmitField: ", hasSubmitField);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          {renderFields()}
          {steps.length > 1 && (
            <div className="step-indicator">
              <span>Step {currentStep + 1} of {steps.length}</span>
            </div>
          )}
          <div className="modal-actions">
            {steps.length > 1 && currentStep > 0 && (
              <button type="button" onClick={prevStep}>Back</button>
            )}
            {steps.length > 1 && currentStep < steps.length - 1 && (
              <button type="button" onClick={nextStep}>Next</button>
            )}
            {/* Render a submit button only if no submit field exists in the design */}
            {!hasSubmitField && (steps.length <= 1 || currentStep === steps.length - 1) && (
              <button type="submit">Submit</button>
            )}
            {/* <button type="submit">Add User</button> */}
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
        {showAddRoleModal && (
          <AddRoleModal
            organizationId={organizationId}
            onClose={() => setShowAddRoleModal(false)}
            onRoleAdded={(newRole) => {
              setRoleOptions(prev => [...prev, newRole]);
              setFieldValues(prev => ({ ...prev, role_select: newRole.id }));
              setShowAddRoleModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AddUserForm;















