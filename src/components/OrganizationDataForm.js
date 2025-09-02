import React, { useState, useEffect } from 'react';
import './OrganizationDataForm.css'; // add your styling
import { Field, ErrorMessage, useFormikContext } from 'formik';
// For brevity, only a few countries are listed; in production use a full alphabetical list.
const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Antigua & Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Bahamas",
  "Behrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia & Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada", 
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Costa Rica",
  "Côte d’Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Eqypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India", 
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Maozambique",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia",
  "Norway","Oman","Pakistan","Panama","Paragua","Peru","Philippines","Poland",
  "Poland","Portugal","Qatar","Romania","Russia","Rwanda",
  "Saint Kitts & Nevis","Saint Lucia","Saint Vincent & the Grenadines",
  "Samoa","San Marino","Sao Tome & Principe", "Saudi Arabia","Senegal",
  "Serbia","Seychelles","Sierra Leone",
  "Singapore","Slovakia","Slovenia","Somalia","South Africa","Spain",
  "Sri Lanka","Sudan","Sudan, South","Suriname","Sweden",
  "Switzerland","Syria","Taiwan","Tanzania","Thailand","Togo",
  "Tonga","Trinidad & Tobago","Tunisia","Turkey","Uganda",
  "Ukraine","United Arab Emirates",
  "United Kingdom", "United States",
  "Uruguay","Vatican City","Venezuela","Vietnam",
  "Yemen","Zambia","Zimbabwe",

];





const OrganizationDataForm = () => {
  const { values, setFieldValue } = useFormikContext();
  const [logoPreviews, setLogoPreviews] = useState([]);

  useEffect(() => {
    if (values.orgLogo) {
      // If orgLogo is a FileList or array of Files, create preview URLs.
      const files = Array.isArray(values.orgLogo) ? values.orgLogo : [values.orgLogo];
      const previews = files.map(file => URL.createObjectURL(file));
      setLogoPreviews(previews);
      // Cleanup: revoke object URLs when component unmounts or when files change.
      return () => {
        previews.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      setLogoPreviews([]);
    }
  }, [values.orgLogo]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setFieldValue("orgLogo", files);
  };

  return (
    <div className="organization-data-form">
      <div className="form-group">
        <label>Organization Name*:</label>
        <Field name="name" type="text" required />
        <ErrorMessage name="name" component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Organizational Email*:</label>
        <Field name="orgEmail" type="email" required />
        <ErrorMessage name="orgEmail" component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Country*:</label>
        <Field as="select" name="country" required>
          <option value="">Select Country</option>
          {countries.map((country, index) => (
            <option key={`${country}-${index}`} value={country}>{country}</option>
          ))}
        </Field>
        <ErrorMessage name="country" component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Organization Type*:</label>
        <Field as="select" name="type" required>
          <option value="">Select Type</option>
          <option value="Government">Government</option>
          <option value="Private">Private</option>
          <option value="NGO">NGO</option>
        </Field>
        <ErrorMessage name="type" component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Nature*:</label>
        <Field as="select" name="nature" required>
          <option value="">Select Nature</option>
          <option value="Single Managed">Single Managed</option>
          <option value="Branch Managed">Branch Managed</option>
        </Field>
        <ErrorMessage name="nature" component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Employee Range*:</label>
        <Field name="employeeRange" type="text" required />
        <ErrorMessage name="employeeRange" component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Upload Logos* (max 3):</label>
        <input type="file" accept="image/*" multiple onChange={handleFileUpload} />
      </div>
      <div className="logos-preview">
        {logoPreviews.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index + 1}`}
            style={{ width: '64px', height: '64px', objectFit: 'cover', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default OrganizationDataForm;