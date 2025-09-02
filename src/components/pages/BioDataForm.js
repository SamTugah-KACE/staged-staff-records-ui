import React, { useState, useEffect } from 'react';
import '../PersonalDataForm.css'


const genders = ["Male", "Female", "Other"];
const BioDataForm = ({ data, updateData }) => {
  const [localData, setLocalData] = useState({
      // title: '',
      // otherTitle: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      contactInfo: '',
      profileImage: '',
      // capturedImage: null,
      uploadedImage: null
    });

  // const handleChange = (e) => {
  //   updateData({ [e.target.name]: e.target.value });
  // };
  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });
    useEffect(() => {
      updateData(localData);
    }, [localData, updateData]);

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setLocalData((prev) => ({ ...prev, uploadedImage: imageUrl }));
      }
    };

    // const handleChange = (e) => {
    //   const { name, value } = e.target;
    //   setLocalData((prev) => ({
    //     ...prev,
    //     [name]: value
    //   }));

  // return (
  //   <div>
  //     <label>First Name*: </label>
  //     <input type="text" name="firstName" onChange={handleChange} required />
  //     <br />
  //     <label>Last Name*: </label>
  //     <input type="text" name="lastName" onChange={handleChange} required />
  //     <br />
  //     <label>Gender*: </label>
  //     <select  name="gender" onChange={handleChange} required >
  //       <option value="Male">Male</option>
  //       <option value="Female">Female</option>
  //       <option value="Other">Other</option>
  //     </select>
  //     <br />
  //     <label>Date of Birth*: </label>
  //     <input type="date" name="dob" onChange={handleChange} required />
  //     <br />
  //     <label>Email*: </label>
  //     <input type="email" name="email" onChange={handleChange} required />
  //     <br />
  //     <label>Contact Info*: </label>
  //     <textarea name="contact" onChange={handleChange} required></textarea>
  //     <br />
  //     <label>Profile Image*: </label>
  //     <input type="file" name="profileImage" onChange={handleChange} />
  //   </div>
  // );

return (
    <div className="bio-data-form">
      
      <div className="form-group">
        <label>First Name*:</label>
        <input type="text" name="firstName" onChange={handleChange} required defaultValue={data.firstName || ''}/>
      </div>
      <div className="form-group">
        <label>Middle Name:</label>
        <input type="text" name="middleName"  onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Last Name*:</label>
        <input type="text" name="lastName"  onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Date of Birth*:</label>
        <input type="date" name="dateOfBirth"  onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Gender*:</label>
        <select name="gender" value={localData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          {genders.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Email*:</label>
        <input type="email" name="email"  onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Contact | Residential Addr. | GPS Info*:</label>
        <textarea name="contactInfo"  onChange={handleChange} required></textarea>
      </div>
      <div className="form-group">
        <label>Profile Image*:</label>
        <input type="file" name="profileImage" onChange={handleFileUpload} required/>
        {localData.uploadedImage && (
            <img src={localData.uploadedImage} alt="Uploaded" width="64px" style={{"margin-left":"45%"}}  height="64px" className="preview-image" />
          )}
      
      </div>
    
     
    </div>
  );






};

export default BioDataForm;
