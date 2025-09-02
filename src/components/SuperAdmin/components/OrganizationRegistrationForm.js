import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDropzone } from "react-dropzone";
import "./OrganizationRegistrationForm.css";
import { useOrganizations } from "./OrganizationContext";
import { useNavigate } from "react-router-dom"; 
import axios from 'axios';


const FileUpload = ({ onDrop, accept, title, description, multiple, uploadedFiles, onRemoveFile }) => {
  console.log("[FileUpload] Rendering with files:", uploadedFiles);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize: 2 * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      console.log("[FileUpload] Files rejected:", fileRejections);
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            alert(`File ${file.file.name} is too large. Maximum size is 2MB.`);
          }
        });
      });
    }
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`dropzone mt-1 p-4 border-2 border-dashed rounded-md text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
          <ul className="list-disc pl-5 text-xs text-gray-600">
            {uploadedFiles.map((fileItem, index) => (
              <li key={`${fileItem.name}-${index}`} className="flex items-center justify-between py-1">
                <span>
                  {fileItem.name} - {(fileItem.size / 1024).toFixed(2)} KB
                  <span className="text-green-600 ml-2">✓ Ready for upload</span>
                </span>
                {onRemoveFile && (
                 <button
                    type="button"
                    onClick={() => {
                      console.log("[FileUpload] Removing file at index:", index);
                      onRemoveFile(index);
                    }}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function OrganizationRegistrationForm() {
  console.log("[OrganizationRegistrationForm] Component rendering");
  
  const { addOrganization } = useOrganizations();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newOrgId, setNewOrgId] = useState(null);
  
  // Multi-step form setup
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2; 
  
  // File uploads state
  const [logoFiles, setLogoFiles] = useState([]);
  console.log("[OrganizationRegistrationForm] Current logo files:", logoFiles);
  
  const handleLogoUpload = (acceptedFiles) => {
    console.log("[OrganizationRegistrationForm] Files accepted for upload:", acceptedFiles);
    const filesWithMetadata = acceptedFiles.map(file => ({
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }));
    
    console.log("[OrganizationRegistrationForm] Files with metadata:", filesWithMetadata);
    setLogoFiles(prevFiles => [...prevFiles, ...filesWithMetadata]);
  };

  const removeLogoFile = (indexToRemove) => {
    console.log("[OrganizationRegistrationForm] Removing file at index:", indexToRemove);
    setLogoFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };
  
  const schema = yup.object().shape({
    // Organization Details
    organizationName: yup.string().required("Organization name is required"),
    organizationEmail: yup.string().email("Invalid email").required("Organization email is required"),
    organizationNature: yup.string().required("Organization nature is required"),
    domain: yup.string().url("Must be a valid URL").required("Domain name is required"),
    employeeRange: yup.number().typeError("Must be a number").required("Employee count is required"),
    subscriptionPlan: yup.string(),

    // Contact Information
    contactPerson: yup.string().required("Contact person is required"),
    contactEmail: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup.string().required("Phone number is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      organizationNature: "", 
    }
  });

  const formValues = watch();
  console.log("[OrganizationRegistrationForm] Current form values:", formValues);
  console.log("[OrganizationRegistrationForm] Current form errors:", errors);

  const nextStep = async () => {
    console.log("[OrganizationRegistrationForm] Next step clicked from step:", currentStep);
    
    const fieldsToValidateByStep = {
      1: ["organizationName", "organizationEmail", "organizationNature", "domain", "employeeRange", "subscriptionPlan"],
      2: ["contactPerson", "contactEmail", "phoneNumber"],
    };

    console.log("[OrganizationRegistrationForm] Validating fields:", fieldsToValidateByStep[currentStep]);
    
    const isValid = await trigger(fieldsToValidateByStep[currentStep]);
    console.log("[OrganizationRegistrationForm] Validation result:", isValid);
    
    if (isValid) {
      console.log("[OrganizationRegistrationForm] Validation passed - moving to step", currentStep + 1);
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      console.log("[OrganizationRegistrationForm] Validation failed - staying on step", currentStep);
    }
  };
  
  const prevStep = () => {
    console.log("[OrganizationRegistrationForm] Previous step clicked - moving to step", currentStep - 1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  
  const onSubmit = async (data) => {
    console.log("[OrganizationRegistrationForm] Form submission initiated with data:", data);
    try {
      setIsSubmitting(true);
      console.log("[OrganizationRegistrationForm] Submission in progress...");
      
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      
      logoFiles.forEach((fileItem, index) => {
        formData.append(`logoFiles`, fileItem.file);
      });
      
      console.log("[OrganizationRegistrationForm] Sending data to API...");
      
      const response = await axios.post('http://localhost:8000/api/organizations/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("[OrganizationRegistrationForm] API response:", response.data);
      
      const newId = response.data.id || response.data._id || Date.now().toString();
      
      console.log("[OrganizationRegistrationForm] Adding to local context...");
      addOrganization({...data, logoFiles: logoFiles, id: newId});
      
      setNewOrgId(newId);
      setSubmitSuccess(true);
      console.log("[OrganizationRegistrationForm] Submission successful!");
      
      setTimeout(() => {
        console.log("[OrganizationRegistrationForm] Resetting form...");
        reset();
        setLogoFiles([]);        
      }, 3000);
      
    } catch (error) {
      console.error("[OrganizationRegistrationForm] Submission error:", error);
      
      if (error.response) {
        console.error("Server Error:", error.response.data);
        alert(`Server Error: ${error.response.data.message || 'Registration failed'}`);
      } else if (error.request) {
        console.error("Network Error:", error.request);
        alert("Network error. Please check your connection and try again.");
      } else {
        console.error("Error:", error.message);
        alert("An unexpected error occurred during submission");
      }
    } finally {
      setIsSubmitting(false);
      console.log("[OrganizationRegistrationForm] Submission process completed");
    }
  };

  if (submitSuccess) {
    console.log("[OrganizationRegistrationForm] Rendering success state for org ID:", newOrgId);
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Registration Successful!</h2>
          <p className="success-message">Your organization has been registered successfully.</p>
          <div className="success-org-id">
            <p className="success-org-id-text">Organization ID:</p>
            <p className="success-org-id-value">{newOrgId}</p>
          </div>
          <div className="success-actions">
            <button 
              onClick={() => {
                console.log("[OrganizationRegistrationForm] 'Register Another' clicked");
                setSubmitSuccess(false);
                setCurrentStep(1);
              }}
              className="success-btn success-btn-secondary"
            >
              Register Another
            </button>
            <button 
              onClick={() => {
                console.log("[OrganizationRegistrationForm] 'View Organizations' clicked");
                navigate('/organizations');
              }}
              className="success-btn success-btn-primary"
            >
              View Organizations
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("[OrganizationRegistrationForm] Rendering form - current step:", currentStep);
  return (
    <div className="form-container max-w-4xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center">Organization Registration</h1>
      
      {/* Progress Bar */}
      <div className="progress-bar relative mb-10">
        <div className="steps-container flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index} 
              className={`step flex flex-col items-center relative ${
                index + 1 === currentStep ? "active" : ""
              } ${index + 1 < currentStep ? "completed" : ""}`}
            >
              <div 
                className={`step-number w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  index + 1 === currentStep 
                    ? "bg-blue-600" 
                    : index + 1 < currentStep 
                    ? "bg-green-500" 
                    : "bg-gray-300"
                }`}
              >
                {index + 1 < currentStep ? "✓" : index + 1}
              </div>
              <span className="step-name text-xs mt-1 text-gray-600">
                {index === 0 && "Organization"}
                {index === 1 && "Contact"}
              </span>
            </div>
          ))}
        </div>
        
        {/* Progress line */}
        <div className="progress-line absolute top-4 left-0 h-0.5 bg-gray-200 w-full -z-10"></div>
        <div 
          className="progress-line-fill absolute top-4 left-0 h-0.5 bg-blue-500 -z-10 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Organization Details */}
        {currentStep === 1 && (
          <section className="form-section bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Organization Details</h2>
            <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Organization Name*</label>
                <input
                  type="text"
                  {...register("organizationName")}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    errors.organizationName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.organizationName && (
                  <span className="error-message text-red-500 text-sm">{errors.organizationName.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Organization Email*</label>
                <input
                  type="email"
                  {...register("organizationEmail")}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    errors.organizationEmail ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.organizationEmail && (
                  <span className="error-message text-red-500 text-sm">{errors.organizationEmail.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Nature of Organization*</label>
                <select
                  {...register("organizationNature")}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    errors.organizationNature ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="NGO">NGO</option>
                  <option value="Government">Government</option>
                  <option value="private">Private</option>
                </select>
                {errors.organizationNature && (
                  <span className="error-message text-red-500 text-sm">{errors.organizationNature.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Domain*</label>
                <input
                  type="url"
                  {...register("domain")}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    errors.domain ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.domain && (
                  <span className="error-message text-red-500 text-sm">{errors.domain.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Number of Employees*</label>
                <input
                  type="number"
                  {...register("employeeRange")}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    errors.employeeRange ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.employeeRange && (
                  <span className="error-message text-red-500 text-sm">{errors.employeeRange.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
                <select
                  {...register("subscriptionPlan")}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    errors.subscriptionPlan ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="Free">Free</option>
                  <option value="Basic">Basic ($10/month)</option>
                  <option value="Premium">Premium ($25/month)</option>
                  <option value="Enterprise">Enterprise ($100/month)</option>
                </select>
                {errors.subscriptionPlan && (
                  <span className="error-message text-red-500 text-sm">{errors.subscriptionPlan.message}</span>
                )}
              </div>
              
              <div className="md:col-span-2 form-group">
                <label className="block text-sm font-medium text-gray-700">Organization Logo</label>
                <FileUpload
                  onDrop={handleLogoUpload}
                  accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.svg'] }}
                  title="Drag & drop your logo here"
                  description="Accepts PNG, JPG, JPEG up to 2MB"
                  multiple
                  uploadedFiles={logoFiles}
                  onRemoveFile={removeLogoFile}
               />
              </div>
            </div>
          </section>
        )}
        
        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <section className="form-section bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Contact Information</h2>
            <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Primary Contact Person*</label>
                <input
                  type="text"
                  {...register("contactPerson")}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    errors.contactPerson ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.contactPerson && (
                  <span className="error-message text-red-500 text-sm">{errors.contactPerson.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Email*</label>
                <input
                  type="email"
                  {...register("contactEmail")}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    errors.contactEmail ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.contactEmail && (
                  <span className="error-message text-red-500 text-sm">{errors.contactEmail.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phoneNumber && (
                  <span className="error-message text-red-500 text-sm">{errors.phoneNumber.message}</span>
                )}
              </div>
            </div>
          </section>
        )}
        
        {/* Navigation Buttons */}
        <div className="form-navigation flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="btn-secondary px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Previous
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
              disabled={isSubmitting}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="btn-primary px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ml-auto flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Submit Registration"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};        