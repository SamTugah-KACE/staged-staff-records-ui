import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MultiStepForm from './MultiStepForm';
import './SignupPage.css'; // add your styling

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProduct = location.state?.product;

  const handleBack = () => {
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="signup-page">
      <button className="back-button" onClick={handleBack}>
        &larr; Back
      </button>
      <div className="signup-header">
        <h1>Sign Up for {selectedProduct ? selectedProduct.name : 'Our Service'}</h1>
      </div>
      <MultiStepForm selectedProduct={selectedProduct} />
    </div>
  );
};

export default SignupPage;
