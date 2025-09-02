// CompiledFormRenderer.js - Component for rendering compiled forms
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const CompiledFormRenderer = ({ 
  formDesign, 
  organizationId, 
  onClose, 
  onUserAdded,
  roleOptions = [],
  departments = []
}) => {
  const formContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [currentStep, setCurrentStep] = useState(0); // Not needed for compiled forms

  useEffect(() => {
    if (!formDesign || !formContainerRef.current) return;

    try {
      // Clear previous content
      formContainerRef.current.innerHTML = '';

      // Create a style element for the CSS
      const styleElement = document.createElement('style');
      styleElement.textContent = formDesign.css;
      document.head.appendChild(styleElement);

      // Set the HTML content
      formContainerRef.current.innerHTML = formDesign.html;

      // Execute the JavaScript
      if (formDesign.js) {
        // Set global variables for the form
        window.organizationId = organizationId;
        window.onUserAdded = onUserAdded;
        window.onFormClose = onClose;

        // Create and execute the JavaScript
        const scriptElement = document.createElement('script');
        scriptElement.textContent = formDesign.js;
        document.head.appendChild(scriptElement);

        // Clean up script after execution
        setTimeout(() => {
          if (scriptElement.parentNode) {
            scriptElement.parentNode.removeChild(scriptElement);
          }
        }, 100);
      }

      // Populate role options if available
      if (roleOptions.length > 0) {
        const roleSelects = formContainerRef.current.querySelectorAll('select[name*="role"], select[name*="Role"]');
        roleSelects.forEach(select => {
          // Clear existing options except the first one
          while (select.children.length > 1) {
            select.removeChild(select.lastChild);
          }
          
          // Add role options
          roleOptions.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id || role.name;
            option.textContent = role.name;
            select.appendChild(option);
          });
        });
      }

      // Populate department options if available
      if (departments.length > 0) {
        const deptSelects = formContainerRef.current.querySelectorAll('select[name*="department"], select[name*="Department"]');
        deptSelects.forEach(select => {
          // Clear existing options except the first one
          while (select.children.length > 1) {
            select.removeChild(select.lastChild);
          }
          
          // Add department options
          departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            select.appendChild(option);
          });
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error rendering compiled form:', error);
      toast.error('Error rendering form. Please try again.');
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      // Remove the style element when component unmounts
      const styleElements = document.head.querySelectorAll('style');
      styleElements.forEach(style => {
        if (style.textContent.includes('dynamic-form-container')) {
          style.remove();
        }
      });
    };
  }, [formDesign, organizationId, onClose, onUserAdded, roleOptions, departments]);

  if (isLoading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Loading form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!formDesign) {
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

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{ margin: 0, color: '#374151' }}>Add New User</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>
        
        <div ref={formContainerRef} />
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default CompiledFormRenderer;
