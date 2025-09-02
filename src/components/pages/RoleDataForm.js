import React from 'react';

const RoleDataForm = ({ data, updateData }) => {
  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <label>Select Role*: </label>
      <select name="role" onChange={handleChange} required>
        <option value="">Select Role</option>
        <option value="Admin">Admin</option>
        <option value="User">User</option>
        <option value="Other">Other</option>
      </select>
      {data.role === 'Other' && (
        <>
          <label>Enter Role Name: </label>
          <input type="text" name="otherRole" onChange={handleChange} />
          <br />
          <label>Permissions*: </label>
          <div>
            <label>
              <input type="checkbox" name="perm1" onChange={handleChange} />
              Custom Permission 1
            </label>
            <label>
              <input type="checkbox" name="perm2" onChange={handleChange} />
              Custom Permission 2
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default RoleDataForm;
