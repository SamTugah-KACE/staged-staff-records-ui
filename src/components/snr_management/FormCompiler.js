// FormCompiler.js - Utility for compiling form designs into HTML, CSS, and JS

/**
 * Generate auto CSS for the form
 */
export const generateFormCSS = (fields) => {
  // CSS is generic and works for both single-step and multi-step forms
  
  return `
    /* Auto-generated Form CSS */
    .dynamic-form-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .form-step {
      display: none;
      animation: fadeIn 0.3s ease-in-out;
    }
    
    .form-step.active {
      display: block;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-group input[type="file"] {
      padding: 8px;
      border: 2px dashed #d1d5db;
      background: #f9fafb;
    }
    
    .form-group input[type="file"]:hover {
      border-color: #3b82f6;
      background: #eff6ff;
    }
    
    .options-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .options-horizontal {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .option-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      transition: background-color 0.2s ease;
    }
    
    .option-label:hover {
      background-color: #f3f4f6;
    }
    
    .option-label input[type="radio"],
    .option-label input[type="checkbox"] {
      width: auto;
      margin: 0;
    }
    
    .step-indicator {
      text-align: center;
      margin: 20px 0;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
      font-weight: 600;
      color: #64748b;
    }
    
    .step-progress {
      width: 100%;
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      margin: 10px 0;
      overflow: hidden;
    }
    
    .step-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      border-radius: 2px;
      transition: width 0.3s ease;
    }
    
    .form-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    
    .nav-button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 120px;
    }
    
    .nav-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .nav-button.back {
      background: #f3f4f6;
      color: #374151;
    }
    
    .nav-button.back:hover:not(:disabled) {
      background: #e5e7eb;
    }
    
    .nav-button.next,
    .nav-button.submit {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }
    
    .nav-button.next:hover:not(:disabled),
    .nav-button.submit:hover:not(:disabled) {
      background: linear-gradient(135deg, #2563eb, #1e40af);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    
    .submit-button {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 14px 32px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
    }
    
    .submit-button:hover {
      background: linear-gradient(135deg, #059669, #047857);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .dynamic-form-container {
        margin: 10px;
        padding: 16px;
      }
      
      .options-horizontal {
        flex-direction: column;
      }
      
      .form-navigation {
        flex-direction: column;
        gap: 12px;
      }
      
      .nav-button {
        width: 100%;
      }
    }
    
    @media (max-width: 480px) {
      .form-group input,
      .form-group select,
      .form-group textarea {
        font-size: 16px; /* Prevents zoom on iOS */
      }
    }
  `;
};

/**
 * Generate HTML for a single field
 */
const generateFieldHTML = (field) => {
  let fieldHtml = `
    <div class="form-group">
      <label for="${field.label.replace(/\s+/g, '_')}">${field.label}${field.required ? ' *' : ''}</label>
  `;
  
  switch (field.id) {
    case 'text':
    case 'email':
    case 'url':
    case 'date':
    case 'phone':
    case 'number':
      fieldHtml += `
        <input 
          type="${field.id}" 
          id="${field.label.replace(/\s+/g, '_')}" 
          name="${field.label}" 
          placeholder="${field.label}"
          ${field.required ? 'required' : ''}
        />
      `;
      break;
      
    case 'text_area':
      fieldHtml += `
        <textarea 
          id="${field.label.replace(/\s+/g, '_')}" 
          name="${field.label}" 
          placeholder="${field.label}"
          rows="4"
          ${field.required ? 'required' : ''}
        ></textarea>
      `;
      break;
      
    case 'radio':
      if (field.options?.choices) {
        fieldHtml += `
          <div class="options-${field.options.choices.length <= 3 ? 'horizontal' : 'group'}">
        `;
        field.options.choices.forEach(choice => {
          fieldHtml += `
            <label class="option-label">
              <input type="radio" name="${field.label}" value="${choice}" ${field.required ? 'required' : ''} />
              ${choice}
            </label>
          `;
        });
        fieldHtml += `</div>`;
      }
      break;
      
    case 'checkbox':
      if (field.options?.choices) {
        fieldHtml += `
          <div class="options-${field.options.choices.length <= 3 ? 'horizontal' : 'group'}">
        `;
        field.options.choices.forEach(choice => {
          fieldHtml += `
            <label class="option-label">
              <input type="checkbox" name="${field.label}" value="${choice}" />
              ${choice}
            </label>
          `;
        });
        fieldHtml += `</div>`;
      }
      break;
      
    case 'select':
      fieldHtml += `
        <select id="${field.label.replace(/\s+/g, '_')}" name="${field.label}" ${field.required ? 'required' : ''}>
          <option value="">Select an option</option>
      `;
      if (field.options?.choices) {
        field.options.choices.forEach(choice => {
          fieldHtml += `<option value="${choice}">${choice}</option>`;
        });
      }
      fieldHtml += `</select>`;
      break;
      
    case 'role_select':
      fieldHtml += `
        <select id="${field.label.replace(/\s+/g, '_')}" name="${field.label}" ${field.required ? 'required' : ''}>
          <option value="">Select a role</option>
          <!-- Role options will be populated dynamically -->
        </select>
      `;
      break;
      
    case 'file':
      fieldHtml += `
        <input 
          type="file" 
          id="${field.label.replace(/\s+/g, '_')}" 
          name="${field.label}" 
          multiple
          ${field.required ? 'required' : ''}
        />
      `;
      break;
      
    default:
      // Fallback for unknown field types
      fieldHtml += `
        <input 
          type="text" 
          id="${field.label.replace(/\s+/g, '_')}" 
          name="${field.label}" 
          placeholder="${field.label}"
          ${field.required ? 'required' : ''}
        />
      `;
      break;
  }
  
  fieldHtml += `</div>`;
  return fieldHtml;
};

/**
 * Generate HTML for a single step
 */
const generateStepHTML = (stepFields, stepIndex) => {
  const isActive = stepIndex === 0 ? 'active' : '';
  let stepHtml = `
    <div class="form-step ${isActive}" data-step="${stepIndex}">
  `;
  
  stepFields.forEach(field => {
    if (field.id === 'submit') return; // Skip submit fields in HTML generation
    const fieldHtml = generateFieldHTML(field);
    stepHtml += fieldHtml;
  });
  
  stepHtml += `</div>`;
  return stepHtml;
};

/**
 * Generate navigation HTML for multi-step forms
 */
const generateNavigationHTML = (steps) => {
  return `
    <div class="form-navigation">
      <button type="button" class="nav-button back" id="prev-btn" style="display: none;">← Back</button>
      <div class="step-indicator">
        Step <span id="current-step">1</span> of <span id="total-steps">${steps}</span>
      </div>
      <button type="button" class="nav-button next" id="next-btn">Next →</button>
    </div>
  `;
};

/**
 * Generate form HTML structure
 */
export const generateFormHTML = (fields) => {
  const isMultiStep = fields.length > 4;
  const steps = isMultiStep ? Math.ceil(fields.length / 4) : 1;
  const fieldsPerStep = Math.ceil(fields.length / steps);
  
  let html = `
    <div class="dynamic-form-container">
      <form id="dynamic-user-form" class="dynamic-form">
  `;
  
  if (isMultiStep) {
    // Add step progress indicator
    html += `
      <div class="step-progress">
        <div class="step-progress-bar" id="progress-bar" style="width: ${100 / steps}%"></div>
      </div>
    `;
  }
  
  // Generate steps
  for (let stepIndex = 0; stepIndex < steps; stepIndex++) {
    const stepFields = fields.slice(stepIndex * fieldsPerStep, (stepIndex + 1) * fieldsPerStep);
    const stepHtml = generateStepHTML(stepFields, stepIndex);
    html += stepHtml;
  }
  
  // Add navigation buttons for multi-step forms
  if (isMultiStep) {
    html += generateNavigationHTML(steps);
  }
  
  // Add submit button
  html += `
    <button type="submit" class="submit-button">Add New User</button>
  `;
  
  html += `
      </form>
    </div>
  `;
  
  return html;
};

/**
 * Generate JavaScript for form functionality
 */
export const generateFormJS = (fields) => {
  const isMultiStep = fields.length > 4;
  const steps = isMultiStep ? Math.ceil(fields.length / 4) : 1;
  
  return `
    // Auto-generated Form JavaScript
    (function() {
      let currentStep = 0;
      const totalSteps = ${steps};
      const form = document.getElementById('dynamic-user-form');
      const progressBar = document.getElementById('progress-bar');
      const currentStepSpan = document.getElementById('current-step');
      const totalStepsSpan = document.getElementById('total-steps');
      const prevBtn = document.getElementById('prev-btn');
      const nextBtn = document.getElementById('next-btn');
      
      // Initialize form
      function initForm() {
        if (totalSteps > 1) {
          updateStepDisplay();
          updateNavigationButtons();
        }
        
        // Add form validation
        form.addEventListener('submit', handleSubmit);
        
        if (nextBtn) nextBtn.addEventListener('click', nextStep);
        if (prevBtn) prevBtn.addEventListener('click', prevStep);
      }
      
      // Update step display
      function updateStepDisplay() {
        const steps = document.querySelectorAll('.form-step');
        steps.forEach((step, index) => {
          step.classList.toggle('active', index === currentStep);
        });
        
        if (progressBar) {
          progressBar.style.width = ((currentStep + 1) / totalSteps) * 100 + '%';
        }
        
        if (currentStepSpan) currentStepSpan.textContent = currentStep + 1;
        if (totalStepsSpan) totalStepsSpan.textContent = totalSteps;
      }
      
      // Update navigation buttons
      function updateNavigationButtons() {
        if (prevBtn) {
          prevBtn.style.display = currentStep > 0 ? 'block' : 'none';
        }
        
        if (nextBtn) {
          nextBtn.style.display = currentStep < totalSteps - 1 ? 'block' : 'none';
          nextBtn.textContent = currentStep === totalSteps - 1 ? 'Submit' : 'Next →';
        }
      }
      
      // Navigate to next step
      function nextStep() {
        if (validateCurrentStep()) {
          if (currentStep < totalSteps - 1) {
            currentStep++;
            updateStepDisplay();
            updateNavigationButtons();
          } else {
            form.dispatchEvent(new Event('submit'));
          }
        }
      }
      
      // Navigate to previous step
      function prevStep() {
        if (currentStep > 0) {
          currentStep--;
          updateStepDisplay();
          updateNavigationButtons();
        }
      }
      
      // Validate current step
      function validateCurrentStep() {
        const currentStepElement = document.querySelector(\`.form-step[data-step="\${currentStep}"]\`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            isValid = false;
          } else {
            field.style.borderColor = '#e5e7eb';
          }
        });
        
        if (!isValid) {
          alert('Please fill in all required fields before proceeding.');
        }
        
        return isValid;
      }
      
      // Handle form submission
      function handleSubmit(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
          return;
        }
        
        // Collect form data
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
          if (data[key]) {
            if (Array.isArray(data[key])) {
              data[key].push(value);
            } else {
              data[key] = [data[key], value];
            }
          } else {
            data[key] = value;
          }
        }
        
        // Add organization_id (this should be passed from the parent component)
        data.organization_id = window.organizationId || '';
        
        console.log('Form data:', data);
        
        // Submit form data
        submitFormData(data);
      }
      
      // Submit form data to server
      async function submitFormData(data) {
        try {
          const hasFileField = document.querySelector('input[type="file"]');
          
          let response;
          if (hasFileField) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
              if (value instanceof FileList) {
                Array.from(value).forEach(file => formData.append(key, file));
              } else {
                formData.append(key, value);
              }
            });
            response = await fetch('/users/create', {
              method: 'POST',
              body: formData
            });
          } else {
            response = await fetch('/users/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
          }
          
          if (response.ok) {
            alert('User added successfully!');
            form.reset();
            if (window.onUserAdded) window.onUserAdded();
          } else {
            throw new Error('Failed to add user');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Error adding user. Please try again.');
        }
      }
      
      // Initialize when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initForm);
      } else {
        initForm();
      }
    })();
  `;
};

/**
 * Compile complete form with HTML, CSS, and JS
 */
export const compileForm = (fields) => {
  const isMultiStep = fields.length > 4;
  const totalSteps = isMultiStep ? Math.ceil(fields.length / 4) : 1;
  
  return {
    fields: fields,
    isMultiStep: isMultiStep,
    totalSteps: totalSteps,
    html: generateFormHTML(fields),
    css: generateFormCSS(fields),
    js: generateFormJS(fields),
    metadata: {
      createdAt: new Date().toISOString(),
      fieldCount: fields.length,
      hasFileUpload: fields.some(f => f.id === 'file'),
      hasRoleSelection: fields.some(f => f.id === 'role_select'),
      hasRadioButtons: fields.some(f => f.id === 'radio'),
      hasCheckboxes: fields.some(f => f.id === 'checkbox'),
      hasSelectDropdowns: fields.some(f => f.id === 'select'),
      requiredFieldsCount: fields.filter(f => f.required).length,
      fieldTypes: [...new Set(fields.map(f => f.id))],
      estimatedCompletionTime: Math.ceil(fields.length * 0.5) // Rough estimate in minutes
    }
  };
};

/**
 * Validate form compilation
 */
export const validateFormCompilation = (compiledForm) => {
  const errors = [];
  
  if (!compiledForm.fields || compiledForm.fields.length === 0) {
    errors.push('No fields defined');
  }
  
  if (!compiledForm.html) {
    errors.push('HTML generation failed');
  }
  
  if (!compiledForm.css) {
    errors.push('CSS generation failed');
  }
  
  if (!compiledForm.js) {
    errors.push('JavaScript generation failed');
  }
  
  // Check for required fields
  const hasRequiredFields = compiledForm.fields.some(f => f.required);
  if (!hasRequiredFields) {
    errors.push('No required fields defined - consider making some fields mandatory');
  }
  
  // Check for submit field
  const hasSubmitField = compiledForm.fields.some(f => f.id === 'submit');
  if (!hasSubmitField) {
    errors.push('No submit field found - form may not be submittable');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    warnings: []
  };
};
