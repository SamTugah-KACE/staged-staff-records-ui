
// src/components/PersonalDataForm.js
import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import Webcam from 'react-webcam';
import './PersonalDataForm.css';

const titles = ["Prof.", "PhD", "Dr.", "Mr.", "Mrs.", "Ms.", "Esq.", "Hon.", "Rev.", "Msgr.", "Other"];
const genders = ["Male", "Female", "Other"];

const PersonalDataForm = () => {
  const { values, setFieldValue } = useFormikContext();
  const webcamRef = React.useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [fetchedRoles, setFetchedRoles] = useState([]);
  const [roleError, setRoleError] = useState("");

  // Fetch and filter roles from API
  useEffect(() => {
    // fetch('http://localhost:8000/api/default/fetch-all/?skip=0&limit=100')
    //fetch('https://staff-records-backend.onrender.com/api/default/fetch-all/?skip=0&limit=100')
      fetch('https://staff-records-backend-1b65.onrender.com/api/default/fetch-all/?skip=0&limit=100')
      .then(res => res.json())
      .then(data => {
        const rolesItem = data.find(item => item.data_name === "roles");
        if (rolesItem && Array.isArray(rolesItem.data)) {
          // Only allow these roles.
          const allowedRoles = ["CEO",  "HR Manager"];
          const filteredRoles = rolesItem.data.filter(role =>
            allowedRoles.includes(role.name)
          );
          setFetchedRoles(filteredRoles);
          // Auto-set role and permissions if none selected
          if (!values.role && filteredRoles.length > 0) {
            setFieldValue("role", filteredRoles[0].name);
            setFieldValue("role_permissions", filteredRoles[0].permissions);
          }
        }
        setLoadingRoles(false);
      })
      .catch(err => {
        console.error("Error fetching roles:", err);
        setLoadingRoles(false);
      });
  }, [setFieldValue, values.role]);

  // Check if the selected role has the required permission(s)
  useEffect(() => {
    // Clear error if role not yet set or roles haven't been fetched
    if (!values.role || fetchedRoles.length === 0) {
      setRoleError("");
      return;
    }
    // Find the selected role
    const selectedRole = fetchedRoles.find(role => role.name === values.role);
    if (selectedRole) {
      const hasPermission = selectedRole.permissions.includes("organization:create") ||
                            selectedRole.permissions.includes("organization:manage");
      setRoleError(hasPermission 
                   ? "" 
                   : "You do not have permission to sign an organization up on this platform.");
    }
  }, [values.role, fetchedRoles]);

  // Fetch default roles from API
  // useEffect(() => { 
  //   fetch('https://staff-records-backend.onrender.com/api/default/fetch-all/?skip=0&limit=100')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const rolesItem = data.find(item => item.data_name === "roles");
  //       console.log("roles: ", rolesItem);
  //       if (rolesItem && rolesItem.data && rolesItem.data.length > 0) {
  //         setFetchedRoles(rolesItem.data);
  //         // If no role is already selected, auto-set the role field to the first fetched role.
  //         if (!values.role) {
  //           setFieldValue("role", rolesItem.data[0].name);
  //           // Also store the permissions (you can later use this in the submission transformation)
  //           setFieldValue("role_permissions", rolesItem.data[0].permissions);
  //         }
  //       }
  //     })
  //     .catch(err => console.error("Error fetching roles:", err));
  // }, [setFieldValue, values.role]);

  // Update preview when user_images changes.
  useEffect(() => {
    if (values.user_images) {
      // Check if user_images is a File object or a URL
      // console.log("user_images: ", values.user_images);
        console.log("personal image: ", values.user_images);
        console.log("instance:: ", typeof values.user_images);
      
      if (values.user_images instanceof File) {
        const objectUrl = URL.createObjectURL(values.user_images);
        setPreviewImage(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }else {
        setPreviewImage(values.user_images);
      }
    } else {
      setPreviewImage(null);
    }
  }, [values.user_images]);


   // Convert data URL to File
   const dataURLtoFile = (dataurl, filename) => {
    const timestamp = new Date().getTime(); // Get the current timestamp
    const filname = `${filename}-${timestamp}.jpg`;
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filname, {type:mime});
  };


  // const handleCapture = () => {
  //   if (webcamRef.current) {
  //     const imageSrc = webcamRef.current.getScreenshot();
  //     setFieldValue("user_images", imageSrc);
  //   }
  // };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      // Convert the data URL into a File (we use a fixed filename; you can add a timestamp if needed)
      const file = dataURLtoFile(imageSrc, "captured-face");
      setFieldValue("user_images", file);
    }
  };



  const handleUploadChange = (e) => {
    setFieldValue("user_images", e.currentTarget.files[0]);
  };

  return (
  <div className="form-container">
    <div className="personal-data-form"  style={{ opacity: loadingRoles ? 0.5 : 1 }}>
      <div className="form-group">
        <label>Title*:</label>
        <Field as="select" name="title" required>
          <option value="">Select Title</option>
          {titles.map((title, index) => (
            <option key={`${title}-${index}`} value={title}>{title}</option>
          ))}
        </Field>
        <ErrorMessage name="title" style={{"color":"red"}} component="div" className="error" />
      </div>
      {values.title === 'Other' && (
        <div className="form-group">
          <label>Please specify*:</label>
          <Field name="otherTitle" type="text" required />
          <ErrorMessage name="otherTitle" style={{"color":"red"}} component="div" className="error" />
        </div>
      )}
      <div className="form-group">
        <label>First Name*:</label>
        <Field name="firstName" type="text" required />
        <ErrorMessage name="firstName"  style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Middle Name:</label>
        <Field name="middleName" type="text" />
      </div>
      <div className="form-group">
        <label>Last Name*:</label>
        <Field name="lastName" type="text" required />
        <ErrorMessage name="lastName"  style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Date of Birth*:</label>
        <Field name="dob" type="date" required />
        <ErrorMessage name="dob"  style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Gender*:</label>
        <Field as="select" name="gender" required>
          <option value="">Select Gender</option>
          {genders.map((gender, index) => (
            <option key={`${gender}-${index}`} value={gender}>{gender}</option>
          ))}
        </Field>
        <ErrorMessage name="gender" style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Email*:</label>
        <Field name="email" type="email" required />
        <ErrorMessage name="email"  style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Contact | Residential Addr. | GPS Info*:</label>
        <Field as="textarea" name="contactInfo"  required  placeholder={`Contact: \nResidential Addr.: \nGPS: \netc. in that order`} />
        <ErrorMessage name="contactInfo" style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Role*:</label>
        <Field as="select" name="role" required>
          <option value="">Select Your Role</option>
          {fetchedRoles.map((roleObj, index) => (
            <option key={`${roleObj.name}-${index}`} value={roleObj.name}>
              {roleObj.name}
            </option>
          ))}
          {/* {fetchedRoles.length > 0 ? (
            fetchedRoles.map((roleObj, index) => (
              <option key={`${roleObj.name}-${index}`} value={roleObj.name}>{roleObj.name}</option>
            ))
          ) : (
            <>
              <option value="CEO">CEO</option>
              <option value="Manager">Manager</option>
              <option value="HR Manager">HR Manager</option>
            </>
          )} */}
        </Field>
        {roleError && <div style={{ color: 'red' }}>{roleError}</div>}
        <ErrorMessage name="role" style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Profile Image Option*:</label>
        <Field as="select" name="profileImageOption" required>
          <option value="">Select Option</option>
          <option value="capture">Real time capture of user facial image</option>
          <option value="upload">Upload latest image</option>
        </Field>
        <ErrorMessage name="profileImageOption" style={{"color":"red"}} component="div" className="error" />
      </div>
      {values.profileImageOption === 'capture' && (
        <div className="form-group">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="64"
            height="64"
            style={{"margin-left":"45%"}}
            videoConstraints={{ facingMode: 'user' }}
          />
          <button type="button" onClick={handleCapture}>Capture Image</button>
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Captured" width="64" height="64" style={{ marginLeft: '45%' }} />
            </div>
          )}
        </div>
      )}
      {values.profileImageOption === 'upload' && (
        <div className="form-group">
          <input type="file" accept="image/*" onChange={handleUploadChange} required />
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Uploaded" width="64" height="64" style={{ marginTop: '10px', marginLeft: '45%' }} />
            </div>
          )}
        </div>
      )}
    </div>

    {loadingRoles && (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    )}
  </div>

  );
};

export default PersonalDataForm;









