// src/components/EditableDepartmentRow.js
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import request from '../request';
import './EditableDepartmentRow.css';

const EditableDepartmentRow = ({
  department,
  organizationId,
  isBranchManaged,
  staffOptions,
  branchOptions,
  onDepartmentUpdated,
}) => {
  // Local state for the Head of Department and Branch selections
  const [headOption, setHeadOption] = useState(null);
  const [branchOption, setBranchOption] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // On mount or when department changes, set initial select values
  useEffect(() => {
    const initialHead = staffOptions.find(
      (opt) => opt.value === department.department_head_id
    );
    setHeadOption(initialHead || null);
    if (isBranchManaged) {
      const initialBranch = branchOptions.find(
        (opt) => opt.value === department.branch_id
      );
      setBranchOption(initialBranch || null);
    }
    setIsDirty(false);
  }, [department, staffOptions, branchOptions, isBranchManaged]);

  // When the Head selection changes, mark the row as dirty
  const handleHeadChange = (selectedOption) => {
    setHeadOption(selectedOption);
    setIsDirty(true);
  };

  // When the branch selection changes, mark the row as dirty
  const handleBranchChange = (selectedOption) => {
    setBranchOption(selectedOption);
    setIsDirty(true);
  };

  // Update the department using the backend PATCH endpoint
  const handleUpdate = async () => {
    setUpdating(true);
    setError('');
    const payload = {
      name: department.name, // keep name unchanged in this row
      department_head_id: headOption ? headOption.value : null,
      branch_id: isBranchManaged && branchOption ? branchOption.value : null,
    };
    try {
      const response = await request.patch(
        `/api/organizations/${organizationId}/departments/${department.id}`,
        payload
      );
      onDepartmentUpdated(response.data);
      setIsDirty(false);
    } catch (err) {
      console.error('Error updating department:', err);
      setError(error.response?.data?.detail || 'Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <tr className="editable-dept-row">
      <td>{department.name}</td>
      <td>
        <Select
          value={headOption}
          onChange={handleHeadChange}
          options={staffOptions}
          placeholder="Select Head..."
          isClearable
        />
      </td>
      {isBranchManaged && (
        <td>
          <Select
            value={branchOption}
            onChange={handleBranchChange}
            options={branchOptions}
            placeholder="Select Branch..."
            isClearable
          />
        </td>
      )}
      <td>
        <button
          className="update-btn"
          onClick={handleUpdate}
          disabled={!isDirty || updating}
        >
          {updating ? 'Updating...' : 'Update'}
        </button>
        {error && <div className="row-error">{error}</div>}
      </td>
    </tr>
  );
};

export default EditableDepartmentRow;



// // src/components/EditableDepartmentRow.js
// import React, { useEffect, useState } from 'react';
// import Select from 'react-select';
// import request from '../request';
// import './EditableDepartmentRow.css';

// const EditableDepartmentRow = ({
//   department,
//   organizationId,
//   isBranchManaged,
//   staffOptions,
//   branchOptions,
//   onDepartmentUpdated,
// }) => {
//   // Local state to hold the selected head and branch
//   const [headOption, setHeadOption] = useState(null);
//   const [branchOption, setBranchOption] = useState(null);
//   const [isDirty, setIsDirty] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [error, setError] = useState('');

//   // On mount (or when options change), set initial select values using department data.
//   useEffect(() => {
//     const initialHead = staffOptions.find(
//       (opt) => opt.value === department.department_head_id
//     );
//     setHeadOption(initialHead || null);
//     if (isBranchManaged) {
//       const initialBranch = branchOptions.find(
//         (opt) => opt.value === department.branch_id
//       );
//       setBranchOption(initialBranch || null);
//     }
//     setIsDirty(false);
//   }, [department, staffOptions, branchOptions, isBranchManaged]);

//   // Mark the row as dirty if the head selection changes.
//   const handleHeadChange = (selectedOption) => {
//     setHeadOption(selectedOption);
//     setIsDirty(true);
//   };

//   // If branch-managed, mark the row as dirty when branch changes.
//   const handleBranchChange = (selectedOption) => {
//     setBranchOption(selectedOption);
//     setIsDirty(true);
//   };

//   // Handle the update button click.
//   const handleUpdate = async () => {
//     setUpdating(true);
//     setError('');
//     const payload = {
//       name: department.name, // keep existing name
//       department_head_id: headOption ? headOption.value : null,
//       branch_id: isBranchManaged && branchOption ? branchOption.value : null,
//     };
//     try {
//       const response = await request.patch(
//         `/api/organizations/${organizationId}/departments/${department.id}`,
//         payload
//       );
//       onDepartmentUpdated(response.data);
//       setIsDirty(false);
//     } catch (error) {
//       console.error('Error updating department:', error);
//       setError(error.response?.data?.detail || 'Update failed.');
//       alert(
//         'Error updating department: ' +
//           (error.response?.data?.detail || error.message)
//       );
//     } finally {
//       setUpdating(false);
//     }
//   };

//   return (
//     <tr className="editable-dept-row">
//       <td>{department.name}</td>
//       <td>
//         <Select
//           value={headOption}
//           onChange={handleHeadChange}
//           options={staffOptions}
//           placeholder="Select Head..."
//           isClearable
//         />
//       </td>
//       {isBranchManaged && (
//         <td>
//           <Select
//             value={branchOption}
//             onChange={handleBranchChange}
//             options={branchOptions}
//             placeholder="Select Branch..."
//             isClearable
//           />
//         </td>
//       )}
//       <td>
//         <button
//           className="update-btn"
//           onClick={handleUpdate}
//           disabled={!isDirty || updating}
//         >
//           {updating ? 'Updating...' : 'Update'}
//         </button>
//         {error && <div className="row-error">{error}</div>}
//       </td>
//     </tr>
//   );
// };

// export default EditableDepartmentRow;
