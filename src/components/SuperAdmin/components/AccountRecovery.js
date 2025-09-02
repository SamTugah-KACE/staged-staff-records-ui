import { useState, useEffect } from 'react';
import './AccountRecovery.css';

const AccountRecovery = () => {
  console.log('AccountRecovery component rendered');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    contact: '',
    photos: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('Modal state changed:', { isModalOpen });
    
    if (isModalOpen) {
      console.log('Setting body overflow to hidden');
      document.body.style.overflow = 'hidden';
    } else {
      console.log('Setting body overflow to auto');
      document.body.style.overflow = 'auto';
    }

    return () => {
      console.log('Cleanup: Setting body overflow to auto');
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const openModal = () => {
    console.log('Opening modal');
    setIsModalOpen(true);
    resetForm();
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    console.log('Resetting form data');
    setFormData({
      organization:'',
      email: '',
      contact: '',
      photos: null
    });
    setError('');
    setSuccess('');
    setIsSubmitting(false);
    console.log('Form reset completed');
  };

  const validateEmail = (email) => {
    console.log('Validating email:', email);
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = re.test(email);
    console.log('Email validation result:', isValid);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    console.log('Input changed:', { field: id, value, length: value.length });
    
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [id]: value
      };
      console.log('Updated form data:', newData);
      return newData;
    });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    console.log('File input changed:', { 
      filesCount: files ? files.length : 0,
      files: files ? Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type })) : null
    });
    
    if (files && files.length > 0) {
      setFormData(prevData => {
        const newData = {
          ...prevData,
          photos: files
        };
        console.log('Updated form data with files:', newData);
        return newData;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submission started');
    console.log('Current form data:', formData);
    
    setError('');
    setIsSubmitting(true);
    
    if (formData.organization.trim() === '') {
      console.log('Validation failed: Organization is empty');
      setError('Please enter your organization');
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      console.log('Validation failed: Invalid email');
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }
    
    if (formData.contact.trim() === '') {
      console.log('Validation failed: Contact information is empty');
      setError('Please enter your contact information');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.photos || formData.photos.length === 0) {
      console.log('Validation failed: No photos uploaded');
      setError('Please upload at least one photo for verification');
      setIsSubmitting(false);
      return;
    }
    
    console.log('All validations passed, submitting form...');
    
    setTimeout(() => {
      console.log('Simulated API call completed successfully');
      setSuccess('Your account recovery request has been submitted. We will contact you shortly.');
      setIsSubmitting(false);
      
      setTimeout(() => {
        console.log('Auto-closing modal after success');
        closeModal();
      }, 3000);
    }, 1500);
  };

  useEffect(() => {
    console.log('State updated:', {
      isModalOpen,
      formDataKeys: Object.keys(formData),
      hasError: !!error,
      hasSuccess: !!success,
      isSubmitting
    });
  }, [isModalOpen, formData, error, success, isSubmitting]);

  return (
    <div className="account-recovery-container">
      <h1>Account Recovery</h1>
      <p>If you've lost access to your account, use the button below to start the recovery process.</p>
      
      <button onClick={openModal} className="open-modal-btn">
        Recover Account
      </button>
      
      {isModalOpen && (
        <div className="account-recovery-modal-overlay" onClick={(e) => {
          console.log('Modal overlay clicked:', e.target.className);
          if (e.target.className === 'account-recovery-modal-overlay') {
            console.log('Closing modal via overlay click');
            closeModal();
          }
        }}>
          <div className="account-recovery-modal-content">
            <div className="account-recovery-modal-header">
              <h2>Account Recovery</h2>
              <button className="account-recovery-close-btn" onClick={() => {
                console.log('Close button clicked');
                closeModal();
              }}>×</button>
            </div>
            
            <div className="account-recovery-modal-body">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              
              <div className="recovery-form">
                  <div className="form-group">
                  <label htmlFor="organization">Organization</label>
                <select onChange={(e) => {
                  console.log('Organization select changed:', e.target.value);
                  handleInputChange({ target: { id: 'organization', value: e.target.value } });
                }}>
                  <option value="">Select...</option>
                  <option value="NGO">NGO</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                </select>
              </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="contact">Contact Information</label>
                  <input
                    type="text"
                    id="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Phone number or alternative contact"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="photos">Upload Verification Photos (Optional)</label>
                  <input
                    type="file"
                    id="photos"
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="file-input"
                    disabled={isSubmitting}
                  />
                  <p className="file-help-text">
                    Please upload a photo of yourself.
                  </p>
                </div>
                
                <div className="form-actions">
                  <button
                    onClick={(e) => {
                      console.log('Submit button clicked');
                      handleSubmit(e);
                    }}
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Recovery Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountRecovery;