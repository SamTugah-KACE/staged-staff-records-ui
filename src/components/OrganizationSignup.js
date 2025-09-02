// // src/components/OrganizationSignup.js
// import React from 'react';
// import MultiStepForm from './MultiStepForm';
// import request from '../request';
// import { useNavigate } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid'; // install uuid package if not already installed
// import './OrganizationSignup.css';

// const OrganizationSignup = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);


//   const handleSubmit = async (data) => {
//     console.log("\n\ndata from MultiStepForm.js: ", data);
//     setLoading(true);
//     // Organize the JSON fields as required
//     // For simplicity, we generate sample objects.
//     const organizationId = uuidv4();
//     const termsAndConditionsId = uuidv4();
//     const roleId = uuidv4();
    
//     // Build tenancies: using subscription plan and billing info from ProductDataForm & BillingForm.
//     const tenancies = [
//       {
//         organization_id: organizationId,
//         start_date: new Date().toISOString().slice(0,10),
//         billing_cycle: data.subscriptionPlan === 'Premium' ? (data.premiumBillingCycle || 'Mid-Year') : 'Monthly',
//         terms_and_conditions_id: termsAndConditionsId,
//         terms_and_conditions: [
//           {
//             title: "Default Terms",
//             content: { billingInfo: data.billingInfo || "Default T&C content" },
//             version: "1.0",
//             is_active: true
//           }
//         ]
//       }
//     ];

//     // Build roles using the selected role and permissions stored from the API fetch in PersonalDataForm.
//     const roles = [
//       {
//         name: data.role,
//         permissions: data.role_permissions || {}, // set in PersonalDataForm from API fetch
//         organization_id: organizationId
//       }
//     ];

//     // Build employees using data from PersonalDataForm.
//     const employees = [
//       {
//         first_name: data.firstName,
//         middle_name: data.middleName,
//         last_name: data.lastName,
//         title: data.title === 'Other' ? data.otherTitle : data.title,
//         gender: data.gender,
//         date_of_birth: data.dob,
//         email: data.email,
//         contact_info: data.contactInfo,
//         hire_date: new Date().toISOString().slice(0,10),
//         termination_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0,10),
//         custom_data: {},
//         profile_image_path: data.user_images ? (typeof data.user_images === 'string' ? data.user_images : data.user_images.name) : "",
//         organization_id: organizationId
//       }
//     ];

//     // Build users using data from PersonalDataForm.
//     const users = [
//       {
//         username: data.email,
//         email: data.email,
//         hashed_password: "",
//         role_id: roleId,
//         organization_id: organizationId,
//         image_path: data.user_images ? (typeof data.user_images === 'string' ? data.user_images : data.user_images.name) : ""
//       }
//     ];

//     // Settings as empty array.
//     const settings = [];

//     // Organize data into FormData for submission.
//     const fd = new FormData();
//     fd.append("name", data.name);
//     fd.append("organizational_email", data.orgEmail);
//     fd.append("country", data.country);
//     fd.append("type", data.type);
//     fd.append("nature", data.nature);
//     fd.append("employee_range", data.employeeRange);
//     fd.append("subscription_plan", data.subscriptionPlan || "Basic");

//     // Append logos (organization logo)
//     if (data.orgLogo) {
//       if (Array.isArray(data.orgLogo)) {
//         data.orgLogo.forEach(file => fd.append("logos", file));
//       } else {
//         fd.append("logos", data.orgLogo);
//       }
//     }

//     // Append user_images (profile image from PersonalDataForm)
//     if (data.user_images) {
//       fd.append("user_images", data.user_images);
//     }

//     // Append JSON fields (tenancies, roles, employees, users, settings)
//     fd.append("tenancies", JSON.stringify(tenancies));
//     fd.append("roles", JSON.stringify(roles));
//     fd.append("employees", JSON.stringify(employees));
//     fd.append("users", JSON.stringify(users));
//     fd.append("settings", JSON.stringify(settings));

//     try {
//       const response = await request.post("/organizations/create-form/", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       const { access_url } = response.data;
//       navigate("/signin");
//     } catch (error) {
//       alert("Error during organization signup: " + error.message);
//     }
//   };

//   return (
//     <div className="organization-signup">
//       <h2>Organization Sign Up</h2>
//       <MultiStepForm onSubmit={handleSubmit} />
//     </div>
//   );
// };

// export default OrganizationSignup;


// src/components/OrganizationSignup.js
/*
import React, { useState } from 'react';
import MultiStepForm from './MultiStepForm';
import request from './request';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Make sure to install uuid via npm or yarn
import './OrganizationSignup.css';


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


const OrganizationSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    console.log("Data from MultiStepForm:", data);
    setLoading(true);
     // Organize data into the structure your API expects.
        const organizationId = uuidv4();
        const termsAndConditionsId = uuidv4();
        const roleId = uuidv4();
    
        // Parse contactInfo from string to dictionary
        const parsedContactInfo = parseContactInfo(data.contactInfo);
    
        const tenancies = [
          {
            organization_id: organizationId,
            start_date: new Date().toISOString().slice(0, 10),
            billing_cycle:
              data.subscriptionPlan === 'Premium'
                ? (data.premiumBillingCycle || 'Mid-Year')
                : 'Monthly',
            terms_and_conditions_id: termsAndConditionsId,
            terms_and_conditions: [
              {
                title: "Default Terms",
                content: { billingInfo: data.billingInfo || "Default T&C content" },
                version: "1.0",
                is_active: true,
              },
            ],
          },
        ];
    
        const roles = [
          {
            name: data.role,
            permissions: data.role_permissions || {},
            organization_id: organizationId,
          },
        ];
    
        const employees = [
          {
            first_name: data.firstName,
            middle_name: data.middleName,
            last_name: data.lastName,
            title: data.title === 'Other' ? data.otherTitle : data.title,
            gender: data.gender,
            date_of_birth: data.dob,
            email: data.email,
            contact_info: parsedContactInfo,
            hire_date: new Date().toISOString().slice(0, 10),
            termination_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
              .toISOString()
              .slice(0, 10),
            custom_data: {},
            profile_image_path: data.user_images
              ? typeof data.user_images === 'string'
                ? data.user_images
                : data.user_images.name
              : "",
            organization_id: organizationId,
          },
        ];
    
        const users = [
          {
            username: data.email,
            email: data.email,
            hashed_password: "",
            role_id: roleId,
            organization_id: organizationId,
            image_path: data.user_images
              ? typeof data.user_images === 'string'
                ? data.user_images
                : data.user_images.name
              : "",
          },
        ];
    
        const settings = [];
    
        // Build FormData
        const fd = new FormData();
        fd.append("name", data.name);
        fd.append("organizational_email", data.orgEmail);
        fd.append("country", data.country);
        fd.append("type", data.type);
        fd.append("nature", data.nature);
        fd.append("employee_range", data.employeeRange);
        fd.append("subscription_plan", data.subscriptionPlan || "Basic");
    
        // Append organization logos
        if (data.orgLogo) {
          if (Array.isArray(data.orgLogo)) {
            data.orgLogo.forEach((file) => fd.append("logos", file));
          } else {
            fd.append("logos", data.orgLogo);
          }
        }
    
        // Append user images (profile image)
        if (data.user_images) {
          fd.append("user_images", data.user_images);
        }
    
        // Append JSON fields
        fd.append("tenancies", JSON.stringify(tenancies));
        fd.append("roles", JSON.stringify(roles));
        fd.append("employees", JSON.stringify(employees));
        fd.append("users", JSON.stringify(users));
        fd.append("settings", JSON.stringify(settings));
    
        try {
          setLoading(true);
          const response = await request.post("/organizations/organizations/create-form/", fd, {
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
      window.location.href = `${access_url}/signin`;
        } catch (error) {
          console.error("Error during organization signup:", error);
          alert("Error during organization signup: " + error.message);
        } finally {
          setLoading(false);
        }
  };

  return (
    <div className="organization-signup">
      <h2>Organization Sign Up</h2>
      {loading && <div className="spinner"></div>}
      <MultiStepForm onSubmit={handleSubmit} />
    </div>
  );
};

export default OrganizationSignup;

*/




// // src/components/OrganizationSignup.js
// import React from 'react';
// import MultiStepForm from './MultiStepForm';
// import request from '../request';
// import { useNavigate } from 'react-router-dom';
// import './OrganizationSignup.css';

// const OrganizationSignup = () => {
//   const navigate = useNavigate();

//   const handleSubmit = async (data) => {
//     // Simple client-side validation (enhance as needed)
//     if (!data.name || !data.orgEmail || !data.country || !data.type || !data.nature || !data.employeeRange) {
//       alert("Please fill all required fields.");
//       return;
//     }
//     // Organize data into FormData (including file uploads and JSON fields)
//     const fd = new FormData();
//     fd.append("name", data.name);
//     fd.append("organizational_email", data.orgEmail);
//     fd.append("country", data.country);
//     fd.append("type", data.type);
//     fd.append("nature", data.nature);
//     fd.append("employee_range", data.employeeRange);
//     fd.append("subscription_plan", data.subscriptionPlan || "Basic");
    
//     if (data.logos && data.logos.length > 0) {
//       data.logos.forEach(file => fd.append("logos", file));
//     }
//     // JSON fields (tenancies, roles, employees, users, settings)
//     fd.append("tenancies", JSON.stringify(data.tenancies || []));
//     fd.append("roles", JSON.stringify(data.roles || []));
//     fd.append("employees", JSON.stringify(data.employees || []));
//     fd.append("users", JSON.stringify(data.users || []));
//     fd.append("settings", JSON.stringify(data.settings || []));

//     try {
//       const response = await request.post("/organizations/create-form/", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       // Assume response.data.access_url exists; if not, use default route
//       const { access_url } = response.data;
//       // Navigate to '/dashboard' (or '/sign-in' appended to the access_url if needed)
//       navigate("/signin");
//     //   navigate("/dashboard");
//     } catch (error) {
//       alert("Error during organization signup: " + error.message);
//     }
//   };

//   return (
//     <div className="organization-signup">
//       <h2>Organization Sign Up</h2>
//       <MultiStepForm onSubmit={handleSubmit} />
//     </div>
//   );
// };

// export default OrganizationSignup;
