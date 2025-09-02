// src/components/MultiStepForm.js
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import request from './request';
import './MultiStepForm.css';

import PersonalDataForm from './PersonalDataForm';
import OrganizationDataForm from './OrganizationDataForm';
import ProductDataForm from './ProductDataForm';
import BillingForm from './BillingForm';
import PaymentForm from './PaymentForm';

const steps = [
  'Personal Data',
  'Organization Data',
  'Product Data',
  'Billing',
  'Payment'
];


const parseContactInfo = (contactStr) => {
  const result = {};
  if (contactStr) {
    const lines = contactStr.split('\n').filter(line => line.trim() !== '');
    lines.forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim();
        result[key] = value;
      }
    });
  }
  return result;
};

// Utility: Check that the date of birth makes the user at least 18.
const isAdult = (dob) => {
  if (!dob) return false;
  const birthDate = new Date(dob);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
};

const personalDataSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  otherTitle: Yup.string().when('title', (title, schema) =>
    title === 'Other' ? schema.required('Please specify your title') : schema
  ),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  dob: Yup.date()
    .required('Date of birth is required')
    .test('is-adult', 'You must be at least 18 years old', (value) => isAdult(value)),
  gender: Yup.string().required('Gender is required'),
  contactInfo: Yup.string().required('Contact info is required'),
  role: Yup.string().required('Role is required'),
  profileImageOption: Yup.string().required('Please select an image option'),
  user_images: Yup.mixed().required('Profile image is required'),
});

const organizationDataSchema = Yup.object().shape({
  name: Yup.string().required('Organization name is required'),
  orgEmail: Yup.string().email('Invalid email').required('Organization email is required'),
  country: Yup.string().required('Country is required'),
  type: Yup.string().required('Organization type is required'),
  nature: Yup.string().required('Organization nature is required'),
  employeeRange: Yup.string().required('Employee range is required'),
  orgLogo: Yup.mixed().required('Organization logo is required'),
});

const productDataSchema = Yup.object().shape({});

const billingSchema = Yup.object().shape({
  // Optionally add validations for billingInfo if needed.
});

const paymentSchema = Yup.object().shape({
  paymentMethod: Yup.string().required('Payment method is required'),
});

const validationSchemas = [
  personalDataSchema,
  organizationDataSchema,
  productDataSchema,
  billingSchema,
  paymentSchema,
];

const MultiStepForm = ({ selectedProduct, onSubmit = (data) => console.log("Submitted:", data) }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    // Personal Data
    title: '',
    otherTitle: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    dob: '',
    gender: '',
    contactInfo: '',
    role: '',
    profileImageOption: '',
    user_images: null,
    // Organization Data
    name: '',
    orgEmail: '',
    country: '',
    type: '',
    nature: '',
    employeeRange: '',
    orgLogo: null,
    // Product Data, Billing, Payment
    productData: '',
    billingInfo: '',
    paymentMethod: '',
    premiumBillingCycle: 'Mid-Year',
    billAmount: 0,
    termsAccepted: false,
    amountToBePaid: 0,
    paymentDate: '',
  };

  const handleFinalSubmit = async (values) => {
    console.log("Final form values:", values);
    onSubmit(values);
    // Organize data into the structure your API expects.
    const organizationId = uuidv4();
    const termsAndConditionsId = uuidv4();
    const roleId = uuidv4();

    // Parse contactInfo from string to dictionary
    const parsedContactInfo = parseContactInfo(values.contactInfo);

    const tenancies = [
      {
        organization_id: organizationId,
        start_date: new Date().toISOString().slice(0, 10),
        billing_cycle:
          values.subscriptionPlan === 'Premium'
            ? (values.premiumBillingCycle || 'Mid-Year')
            : 'Monthly',
        terms_and_conditions_id: termsAndConditionsId,
        terms_and_conditions: [
          {
            title: "Default Terms",
            content: { billingInfo: values.billingInfo || "Default T&C content" },
            version: "1.0",
            is_active: true,
          },
        ],
      },
    ];

    const roles = [
      {
        name: values.role,
        permissions: values.role_permissions || {},
        organization_id: organizationId,
      },
    ];

    const employees = [
      {
        first_name: values.firstName,
        middle_name: values.middleName,
        last_name: values.lastName,
        title: values.title === 'Other' ? values.otherTitle : values.title,
        gender: values.gender,
        date_of_birth: values.dob,
        email: values.email,
        contact_info: parsedContactInfo,
        hire_date: new Date().toISOString().slice(0, 10),
        termination_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          .toISOString()
          .slice(0, 10),
        custom_data: {},
        profile_image_path: values.user_images
          ? typeof values.user_images === 'string'
            ? values.user_images
            : values.user_images.name
          : "",
        organization_id: organizationId,
        rank_id:null,
        department_id:null,
        last_promotion_date: new Date().toISOString().slice(0, 10),
        employee_type_id: null,
      },
    ];

    const users = [
      {
        username: values.email,
        email: values.email,
        hashed_password: "",
        role_id: roleId,
        organization_id: organizationId,
        image_path: values.user_images
          ? typeof values.user_images === 'string'
            ? values.user_images
            : values.user_images.name
          : "",
      },
    ];

    const settings = [];

    // Build FormData
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("organizational_email", values.orgEmail);
    fd.append("country", values.country);
    fd.append("type", values.type);
    fd.append("nature", values.nature);
    fd.append("employee_range", values.employeeRange);
    fd.append("subscription_plan", values.subscriptionPlan || "Basic");

    // Append organization logos
    if (values.orgLogo) {
      if (Array.isArray(values.orgLogo)) {
        values.orgLogo.forEach((file) => fd.append("logos", file));
      } else {
        fd.append("logos", values.orgLogo);
      }
    }

    // Append user images (profile image)
    if (values.user_images) {
      fd.append("user_images", values.user_images);
    }

    // Append JSON fields
    fd.append("tenancies", JSON.stringify(tenancies));
    fd.append("roles", JSON.stringify(roles));
    fd.append("employees", JSON.stringify(employees));
    fd.append("users", JSON.stringify(users));
    fd.append("settings", JSON.stringify(settings));

    try {
      setLoading(true);
      const response = await request.post("/organizations/create-form/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Response from API:", response.data);
      // const { access_url } = response.data;
      // navigate("/signin");
       // Suppose response.data.access_url holds the fake URL and response.data.logos.primary holds the primary logo URL.
  const { access_url, logos } = response.data;
  // Store the logo URL (or pick one from the logos object) in localStorage
  localStorage.setItem('orgLogo', logos?.primary || '');
  // Redirect to the fake URL appended with '/signin'
  // window.location.href = `${access_url}/signin`;

  console.log("env: ", process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
  console.log("\n development** ")
    // window.history.pushState({}, '', `${access_url}/signin`);
    // window.location.reload();
    // navigate(`${access_url}/signin`,  { re/place: true });
    window.location.replace(`${access_url}/signin`);
    // window.location.reload();

    ///// Extract the slug from access_url. If access_url = "https://gi-kace-solutions.onrender.com/ghana-india-kofi-annan-centre-of-excellence-in-ict"
// then slug = "ghana-india-kofi-annan-centre-of-excellence-in-ict"
//const slug = access_url.split('/').pop(); // or your custom extraction logic
// navigate(`/${slug}/signin`);
  } else {
    console.log("\n\nexpect prod.***: ",process.env.NODE_ENV);
    // navigate(`${access_url}/signin`,  { replace: true });
    window.location.replace ( `${access_url}/signin`);
    // window.location.reload();
  }
    } catch (error) {
      console.error("Error during organization signup:", error);
      alert("Error during organization signup: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="multi-step-form">
      <h2>{steps[currentStep]}</h2>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemas[currentStep]}
        onSubmit={(values) => {
          if (currentStep === steps.length - 1) {
            handleFinalSubmit(values);
          } else {
            setCurrentStep(currentStep + 1);
          }
        }}
      >
        {({ isValid, dirty }) => (
          <Form>
            {currentStep === 0 && <PersonalDataForm />}
            {currentStep === 1 && <OrganizationDataForm />}
            {currentStep === 2 && <ProductDataForm selectedProduct={selectedProduct} />}
            {currentStep === 3 && <BillingForm />}
            {currentStep === 4 && <PaymentForm />}
            <div className="navigation-buttons">
              {currentStep > 0 && (
                <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
                  Back
                </button>
              )}
              <button type="submit" disabled={!(isValid && dirty)}>
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
            {loading && <div className="spinner"></div>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MultiStepForm;

















// import React, { useState } from 'react';
// import PersonalDataForm from './PersonalDataForm';
// import OrganizationDataForm from './OrganizationDataForm';
// import ProductDataForm from './ProductDataForm';
// import BillingForm from './BillingForm';
// import PaymentForm from './PaymentForm';
// import './MultiStepForm.css';
// import { useNavigate, useLocation } from 'react-router-dom';
// // import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// const steps = [
//   'Personal Data',
//   'Organization Data',
//   'Product Data',
//   'Billing',
//   'Payment'
// ];


// // Utility function: Check that DOB makes user at least 18 years old.
// const isAdult = (dob) => {
//   if (!dob) return false;
//   const birthDate = new Date(dob);
//   const ageDifMs = Date.now() - birthDate.getTime();
//   const ageDate = new Date(ageDifMs);
//   console.log("\n\nage: ", Math.abs(ageDate.getUTCFullYear() - 1970))
//   return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
// };

// // Yup validation schemas for each step
// // const validationSchemas = [
// //   // Step 0: Personal Data
// //   Yup.object().shape({
// //     firstName: Yup.string().required('First name is required'),
// //     lastName: Yup.string().required('Last name is required'),
// //     email: Yup.string().email('Invalid email').required('Email is required'),
// //     dob: Yup.date()
// //       .required('Date of birth is required')
// //       .test('is-adult', 'You must be at least 18 years old', (value) => isAdult(value)),
// //     profileImage: Yup.mixed().required('Profile image is required'),
// //   }),
// //   // Step 1: Organization Data
// //   Yup.object().shape({
// //     name: Yup.string().required('Organization name is required'),
// //     orgEmail: Yup.string().email('Invalid email').required('Organization email is required'),
// //     country: Yup.string().required('Country is required'),
// //     type: Yup.string().required('Organization type is required'),
// //     nature: Yup.string().required('Organization nature is required'),
// //     employeeRange: Yup.string().required('Employee range is required'),
// //     orgLogo: Yup.mixed().required('Organization logo is required'),
// //   }),
// //   // Step 2: Product Data (optional)
// //   Yup.object().shape({}),
// //   // Step 3: Billing
// //   Yup.object().shape({
// //     billingInfo: Yup.string().required('Billing info is required'),
// //   }),
// //   // Step 4: Payment
// //   Yup.object().shape({
// //     paymentMethod: Yup.string().required('Payment method is required'),
// //   }),
// // ];


// // Default onSubmit function to prevent errors if not provided.
// const MultiStepForm = ({ selectedProduct, onSubmit = (data) => console.log("Submitted:", data) }) => {
//   const navigate = useNavigate();
//   // const location = useLocation();

  
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState({
//     personalData: {},
//     organizationData: {},
//     productData: {},
//     billingData: {},
//     paymentData: {}
//   });

//   const updateFormData = (section, data) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [section]: { ...prevData[section], ...data }
//     }));
//   };

//   const handleNext = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   // Basic per-step validation for required fields.
//   const validateStep = () => {
//     const sectionKey =
//       currentStep === 0 ? 'personalData' :
//       currentStep === 1 ? 'organizationData' :
//       currentStep === 2 ? 'productData' :
//       currentStep === 3 ? 'billingData' :
//       currentStep === 4 ? 'paymentData' : '';
//     const data = formData[sectionKey] || {};
//     let errors = {};

//     // Example validations for each step:
//     if (sectionKey === 'personalData') {
//       if (!data.firstName || data.firstName.trim() === "") {
//         errors.firstName = "First name is required";
//       }
//       if (!data.lastName || data.lastName.trim() === "") {
//         errors.lastName = "Last name is required";
//       }
//       if ( isAdult(data.dob)  ) {
//         errors.dob = "Valid Date of Birth is required and user should be exactly or more than 18yrs of age.";
//       }
//     //   if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
//     //     errors.email = "Valid email is required";
//     //   }
//     // } else if (sectionKey === 'organizationData') {
//     //   if (!data.name || data.name.trim() === "") {
//     //     errors.name = "Organization name is required";
//     //   }
//     //   if (!data.orgEmail || !/^\S+@\S+\.\S+$/.test(data.orgEmail)) {
//     //     errors.orgEmail = "Valid organization email is required";
//     //   }
//     //   if (!data.country || data.country.trim() === "") {
//     //     errors.country = "Country is required";
//     //   }
//     //   if (!data.type || data.type.trim() === "") {
//     //     errors.type = "Organization type is required";
//     //   }
//     //   if (!data.nature || data.nature.trim() === "") {
//     //     errors.nature = "Organization nature is required";
//     //   }
//     //   if (!data.employeeRange || data.employeeRange.trim() === "") {
//     //     errors.employeeRange = "Employee range is required";
//     //   }
//     }
//     // Add similar validations for productData, billingData, paymentData if needed.

//     console.log("errors: ", errors);
//     console.log("\nnumber of errors: ",Object.keys(errors).length);
//     // For now, if there are no errors, return true.
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = () => {
//     // Merge all sections into one object
//     const combinedData = {
//       ...formData.personalData,
//       ...formData.organizationData,
//       ...formData.productData,
//       ...formData.billingData,
//       ...formData.paymentData,
//     };
//     // Call the onSubmit prop (or default function)
//     onSubmit(combinedData);
//     // Optionally navigate, reload, etc.
//     navigate('/signin');
//     window.location.reload();
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <PersonalDataForm
//             data={formData.personalData}
//             updateData={(data) => updateFormData('personalData', data)}
//           />
//         );
//       case 1:
//         return (
//           <OrganizationDataForm
//             data={formData.organizationData}
//             updateData={(data) => updateFormData('organizationData', data)}
//           />
//         );
//       case 2:
//         return (
//           <ProductDataForm
//             data={formData.productData}
//             updateData={(data) => updateFormData('productData', data)}
//             selectedProduct={selectedProduct}
//           />
//         );
//       case 3:
//         return (
//           <BillingForm
//             data={formData.billingData}
//             updateData={(data) => updateFormData('billingData', data)}
//             productData={formData.productData}
//           />
//         );
//       case 4:
//         return (
//           <PaymentForm
//             data={formData.paymentData}
//             updateData={(data) => updateFormData('paymentData', data)}
//             billingData={formData.billingData}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="multi-step-form">
//       <h2>{steps[currentStep]}</h2>
//       <div className="progress-bar">
//         <div
//           className="progress"
//           style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
//         ></div>
//       </div>
//       <form>
//         {renderStep()}
//         <div className="navigation-buttons">
//           {currentStep > 0 && (
//             <button type="button" onClick={handleBack}>
//               Back
//             </button>
//           )}
//           {currentStep < steps.length - 1 && (
//             <button type="button" onClick={handleNext} disabled={!validateStep()}>
//               Next
//             </button>
//           )}
//           {currentStep === steps.length - 1 && (
//             <button type="button" onClick={handleSubmit} disabled={!validateStep()}>
//               Submit
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MultiStepForm;


















// import React, { useState } from 'react';
// import PersonalDataForm from './PersonalDataForm';
// import OrganizationDataForm from './OrganizationDataForm';
// import ProductDataForm from './ProductDataForm';
// import BillingForm from './BillingForm';
// import PaymentForm from './PaymentForm';
// import './MultiStepForm.css'; // add your styling
// import { useNavigate, useLocation } from 'react-router-dom';

// const steps = [
//   'Personal Data',
//   'Organization Data',
//   'Product Data',
//   'Billing',
//   'Payment'
// ];

// const MultiStepForm = ({ selectedProduct, onSubmit = (data) => console.log("Submitted:", data) }) => {
//   // const navigate = useNavigate();
//   // const location = useLocation();

//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState({
//     personalData: {},
//     organizationData: {},
//     productData: {},
//     billingData: {},
//     paymentData: {}
//   });

//   const updateFormData = (section, data) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [section]: { ...prevData[section], ...data }
//     }));
//   };

//   const handleNext = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   const handleSubmit = () => {

//     // Merge all sections into one object
//     const combinedData = {
//       ...formData.personalData,
//       ...formData.organizationData,
//       ...formData.productData,
//       ...formData.billingData,
//       ...formData.paymentData,
//     };
//     onSubmit(combinedData);

//     if (typeof onSubmit === 'function') {
//       onSubmit(combinedData);
//     }
//     // Securely submit the data to your backend
//     // console.log('Form Data Submitted:', formData);
//     // alert('Form submitted successfully!');
//     // navigate('/dashboard');
//     // window.location.reload();
//     // Reset or redirect as needed
//   };

//   // Basic validation: here we simply check that the current section has some data.
//   const validateStep = () => {
//     const sectionKey = 
//       currentStep === 0 ? 'personalData' :
//       currentStep === 1 ? 'organizationData' :
//       currentStep === 2 ? 'productData' :
//       currentStep === 3 ? 'billingData' :
//       currentStep === 4 ? 'paymentData' : '';
//     return formData[sectionKey] && Object.keys(formData[sectionKey]).length > 0;
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <PersonalDataForm
//             data={formData.personalData}
//             updateData={(data) => updateFormData('personalData', data)}
//           />
//         );
//       case 1:
//         return (
//           <OrganizationDataForm
//             data={formData.organizationData}
//             updateData={(data) => updateFormData('organizationData', data)}
//           />
//         );
//       case 2:
//         return (
//           <ProductDataForm
//             data={formData.productData}
//             updateData={(data) => updateFormData('productData', data)}
//             selectedProduct={selectedProduct}
//           />
//         );
//       case 3:
//         return (
//           <BillingForm
//             data={formData.billingData}
//             updateData={(data) => updateFormData('billingData', data)}
//             productData={formData.productData}
//           />
//         );
//       case 4:
//         return (
//           <PaymentForm
//             data={formData.paymentData}
//             updateData={(data) => updateFormData('paymentData', data)}
//             billingData={formData.billingData}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="multi-step-form">
//       <h2>{steps[currentStep]}</h2>
//       <div className="progress-bar">
//         <div
//           className="progress"
//           style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
//         ></div>
//       </div>
//       <form>
//         {renderStep()}
//         <div className="navigation-buttons">
//           {currentStep > 0 && (
//             <button type="button" onClick={handleBack}>
//               Back
//             </button>
//           )}
//           {currentStep < steps.length - 1 && (
//             <button type="button" onClick={handleNext} disabled={!validateStep()}>
//               Next
//             </button>
//           )}
//           {currentStep === steps.length - 1 && (
//             <button type="button" onClick={handleSubmit} disabled={!validateStep()}>
//               Submit
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MultiStepForm;
