import React from 'react';

const CustomDataForm = ({ data, updateData }) => {
  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <label>Custom Data (optional): </label>
      <input type="text" name="customField" onChange={handleChange} />
    </div>
  );
};

export default CustomDataForm;
