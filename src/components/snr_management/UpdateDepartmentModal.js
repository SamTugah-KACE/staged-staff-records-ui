// src/components/UpdateDepartmentModal.js
import React, { useEffect, useState } from 'react';
import './UpdateDepartmentModal.css';
import request from '../request';
import { useOrganization } from '../../context/OrganizationContext';
import EditableDepartmentRow from './EditableDepartmentRow';

const UpdateDepartmentModal = ({ onClose, onDepartmentUpdated }) => {
  const { organization } = useOrganization();
  const organizationId = organization?.id;
  const isBranchManaged =
    organization?.nature?.toLowerCase().includes('branch');

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skip, setSkip] = useState(0);
  const limit = 10;

  // Options for Head of Department select
  const [staffOptions, setStaffOptions] = useState([]);
  // Options for Branch select (if branch-managed)
  const [branchOptions, setBranchOptions] = useState([]);

  // Fetch departments when organizationId or pagination changes
  useEffect(() => {
    if (!organizationId) return;
    const fetchDepartments = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await request.get(
          `/api/organizations/${organizationId}/departments?skip=${skip}&limit=${limit}`
        );
        setDepartments(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || 'Failed to fetch departments.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, [organizationId, skip]);

  // Fetch staff list for Head of Department
  useEffect(() => {
    if (organizationId) {
      request
        .get(`/api/staff?organization_id=${organizationId}&skip=0&limit=1000`)
        .then((response) => {
          const options = response.data.map((emp) => ({
            value: emp.id,
            label: `${emp.title} ${emp.first_name}${emp.middle_name ? ' ' + emp.middle_name : ''} ${emp.last_name}`,
          }));
          setStaffOptions(options);
        })
        .catch((err) =>
          console.error('Error fetching staff list:', err)
        );
    }
  }, [organizationId]);

  // If branch-managed, fetch branch options
  useEffect(() => {
    if (organizationId && isBranchManaged) {
      request
        .get(`/api/organizations/${organizationId}/branches?skip=0&limit=1000`)
        .then((response) => {
          const options = response.data.map((branch) => ({
            value: branch.id,
            label: branch.name,
          }));
          setBranchOptions(options);
        })
        .catch((err) =>
          console.error('Error fetching branch list:', err)
        );
    }
  }, [organizationId, isBranchManaged]);

  const handleNext = () => {
    if (departments.length === limit) {
      setSkip(skip + limit);
    }
  };

  const handlePrev = () => {
    if (skip >= limit) {
      setSkip(skip - limit);
    }
  };

  // Callback when an individual department is updated
  const handleRowUpdate = (updatedDept) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === updatedDept.id ? updatedDept : dept
      )
    );
    if (onDepartmentUpdated) {
      onDepartmentUpdated(updatedDept);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content update-dept-modal">
        <h3>Update Departments</h3>
        {loading ? (
          <div className="spinner"></div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <table className="dept-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Head of Department</th>
                {isBranchManaged && <th>Branch</th>}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <EditableDepartmentRow
                    key={dept.id}
                    department={dept}
                    organizationId={organizationId}
                    isBranchManaged={isBranchManaged}
                    staffOptions={staffOptions}
                    branchOptions={branchOptions}
                    onDepartmentUpdated={handleRowUpdate}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={isBranchManaged ? 4 : 3}>
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <div className="pagination">
          <button onClick={handlePrev} disabled={skip === 0}>
            Previous
          </button>
          <button onClick={handleNext} disabled={departments.length < limit}>
            Next
          </button>
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDepartmentModal;









// // src/components/UpdateDepartmentModal.js
// import React, { useEffect, useState } from 'react';
// import './UpdateDepartmentModal.css';
// import request from '../request';
// import { useOrganization } from '../../context/OrganizationContext';
// import EditableDepartmentRow from './EditableDepartmentRow';

// const UpdateDepartmentModal = ({ onClose }) => {
//   const { organization } = useOrganization();
//   const organizationId = organization?.id;
//   const isBranchManaged = organization?.nature?.toLowerCase().includes('branch');

//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [skip, setSkip] = useState(0);
//   const limit = 10;

//   // These options will be used by each row for the Head of Department select.
//   const [staffOptions, setStaffOptions] = useState([]);
//   const [branchOptions, setBranchOptions] = useState([]);

//   // Fetch departments when organizationId or pagination (skip) changes.
//   useEffect(() => {
//     if (!organizationId) return;
//     const fetchDepartments = async () => {
//       setLoading(true);
//       try {
//         const response = await request.get(
//           `/api/organizations/${organizationId}/departments?skip=${skip}&limit=${limit}`
//         );
//         setDepartments(response.data);
//       } catch (err) {
//         setError(err.response?.data?.detail || 'Failed to fetch departments.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDepartments();
//   }, [organizationId, skip]);

//   // Fetch staff list (for Head of Department)
//   useEffect(() => {
//     if (organizationId) {
//       request
//         .get(`/api/staff?organization_id=${organizationId}&skip=0&limit=1000`)
//         .then((response) => {
//           const options = response.data.map((emp) => ({
//             value: emp.id,
//             label: `${emp.title} ${emp.first_name}${emp.middle_name ? ' ' + emp.middle_name : ''} ${emp.last_name}`,
//           }));
//           setStaffOptions(options);
//         })
//         .catch((err) => console.error('Error fetching staff:', err));
//     }
//   }, [organizationId]);

//   // If branch-managed, fetch branch options.
//   useEffect(() => {
//     if (organizationId && isBranchManaged) {
//       request
//         .get(`/api/organizations/${organizationId}/branches?skip=0&limit=1000`)
//         .then((response) => {
//           const options = response.data.map((branch) => ({
//             value: branch.id,
//             label: branch.name,
//           }));
//           setBranchOptions(options);
//         })
//         .catch((err) => console.error('Error fetching branches:', err));
//     }
//   }, [organizationId, isBranchManaged]);

//   const handleDepartmentUpdated = (updatedDept) => {
//     // Replace the updated department in the list.
//     setDepartments((prev) =>
//       prev.map((dept) => (dept.id === updatedDept.id ? updatedDept : dept))
//     );
//   };

//   const handleNext = () => {
//     if (departments.length === limit) {
//       setSkip(skip + limit);
//     }
//   };

//   const handlePrev = () => {
//     if (skip >= limit) {
//       setSkip(skip - limit);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content view-dept-modal">
//         <h3>Departments</h3>
//         {loading ? (
//           <div className="spinner"></div>
//         ) : error ? (
//           <div className="error-message">{error}</div>
//         ) : (
//           <table className="dept-table">
//             <thead>
//               <tr>
//                 <th>Department Name</th>
//                 <th>Head of Department</th>
//                 {isBranchManaged && <th>Branch</th>}
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {departments.length > 0 ? (
//                 departments.map((dept) => (
//                   <EditableDepartmentRow
//                     key={dept.id}
//                     department={dept}
//                     organizationId={organizationId}
//                     isBranchManaged={isBranchManaged}
//                     staffOptions={staffOptions}
//                     branchOptions={branchOptions}
//                     onDepartmentUpdated={handleDepartmentUpdated}
//                   />
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={isBranchManaged ? 4 : 3}>No departments found.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//         <div className="pagination">
//           <button onClick={handlePrev} disabled={skip === 0}>
//             Previous
//           </button>
//           <button onClick={handleNext} disabled={departments.length < limit}>
//             Next
//           </button>
//         </div>
//         <div className="modal-actions">
//           <button onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateDepartmentModal;
