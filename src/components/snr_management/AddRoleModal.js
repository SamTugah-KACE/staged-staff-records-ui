// src/components/AddRoleModal.jsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // To use createPortal
import './AddRoleModal.css';
import request from '../request';
import { toast } from 'react-toastify';

const AddRoleModal = ({ organizationId, onClose, onRoleAdded }) => {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await request.get('/default/fetch-all/?skip=0&limit=100');
        const data = res.data;
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from API');
        }
        // Find the object where data_name equals "permissions" (case-insensitive)
        const permObj = data.find(
          (item) =>
            item.data_name && item.data_name.toLowerCase() === 'permissions'
        );
        if (permObj && Array.isArray(permObj.data)) {
          setPermissions(permObj.data);
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
        toast.error('Error fetching permissions.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPermissions((prev) =>
      checked ? [...prev, value] : prev.filter((perm) => perm !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.info('Role name is required.');
      return;
    }
    const payload = {
      name: roleName,
      permissions: selectedPermissions,
      organization_id: organizationId,
    };
    try {
      const res = await request.post(
        '/role',
        JSON.stringify(payload),
        // {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${localStorage.getItem('token')}`,
        //   },
        // }
      );
      console.log('Response:', res);
      console.log('Response data:', res.data);
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      // console.log('Response json:', res.json());
      // Check if the response is not empty and has a data property
      if (!res.data || typeof res.data !== 'object') {
        throw new Error('Invalid response data format');
      }
      // Check if the response status is 200 and if the response is ok
      if (res.status !== 200 ) {
        const errorData = res.data;
        throw new Error(errorData.error || errorData.detail || 'Failed to add role');
      }
      const newRole = res.data;
      // toast.success("Role added successfully!");
      onRoleAdded(newRole);
      onClose();
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error(`${error.message}`);
    }
  };

  if (isLoading) {
    return ReactDOM.createPortal(
      <div className="role-modal-overlay">
        <div className="role-modal-content">
        <div className="role-loading">
          <p>Loading permissions…</p>
          {/* Replace with a spinner component if desired */}
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return ReactDOM.createPortal(
    <div className="role-modal-overlay">
      <div className="role-modal-content">
        <div className="role-modal-header">
          <h2>Add New Role</h2>
          <button className="role-close-btn" onClick={onClose} title="Close">
            &times;
          </button>
        </div>
        <div className="role-modal-body">
          <form onSubmit={handleSubmit} className="role-form">
            <div className="form-group">
              <label htmlFor="roleName">Role Name</label>
              <input
              id="roleName"
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
            <div className="form-group">
              <label>Permissions</label>
              <div className="permissions-container">
                {permissions.length > 0 ? (
                  permissions.map((perm, idx) => (
                    <label key={idx} className="permission-label">
                      <input
                        type="checkbox"
                        value={perm}
                        checked={selectedPermissions.includes(perm)}
                        onChange={handleCheckboxChange}
                      />
                      {perm}
                    </label>
                  ))
                ) : (
                  <span className="no-permissions">No permissions available</span>
                )}
              </div>
            </div>
            <div className="role-modal-actions">
              <button type="submit">Add Role</button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddRoleModal;











// // src/components/AddRoleModal.jsx
// import React, { useState, useEffect } from 'react';
// import './AddRoleModal.css';
// import request from '../request';
// import { toast } from 'react-toastify';

// const AddRoleModal = ({ organizationId, onClose, onRoleAdded }) => {
//   const [roleName, setRoleName] = useState('');
//   const [permissions, setPermissions] = useState([]);
//   const [selectedPermissions, setSelectedPermissions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         const res = await request.get('/default/fetch-all/?skip=0&limit=100');
//         const data = res.data;
//         if (!Array.isArray(data)) {
//           throw new Error('Invalid data format received from API');
//         }
//         // Find the object where data_name equals "permissions" (case-insensitive)
//         const permObj = data.find(
//           (item) =>
//             item.data_name && item.data_name.toLowerCase() === 'permissions'
//         );
//         if (permObj && Array.isArray(permObj.data)) {
//           setPermissions(permObj.data);
//         }
//       } catch (error) {
//         console.error('Error fetching permissions:', error);
//         toast.error('Error fetching permissions.');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchPermissions();
//   }, []);

//   const handleCheckboxChange = (e) => {
//     const { value, checked } = e.target;
//     setSelectedPermissions((prev) =>
//       checked ? [...prev, value] : prev.filter((perm) => perm !== value)
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!roleName.trim()) {
//       toast.info('Role name is required.');
//       return;
//     }
//     const payload = {
//       name: roleName,
//       permissions: selectedPermissions,
//       organization_id: organizationId,
//     };
//     try {
//       const res = await request.post(
//         '/role',
//         JSON.stringify(payload),
//         // {
//         //   headers: {
//         //     'Content-Type': 'application/json',
//         //     Authorization: `Bearer ${localStorage.getItem('token')}`,
//         //   },
//         // }
//       );
//       console.log('Response:', res);
//       console.log('Response data:', res.data);
//       console.log('Response status:', res.status);
//       console.log('Response ok:', res.ok);
//       // console.log('Response json:', res.json());
//       // Check if the response is not empty and has a data property
//       if (!res.data || typeof res.data !== 'object') {
//         throw new Error('Invalid response data format');
//       }
//       // Check if the response status is 200 and if the response is ok
//       if (res.status !== 200 ) {
//         const errorData = res.data;
//         throw new Error(errorData || errorData.detail || 'Failed to add role');
//       }
//       const newRole = res.data;
//       onRoleAdded(newRole);
//       toast.success('Role added successfully!');
//       onClose();
//     } catch (error) {
//       console.error('Error adding role:', error);
//       toast.error(`Error adding role: ${error.message}`);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="role-modal-overlay">
//         <div className="role-modal-content">
//           <p>Loading permissions…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="role-modal-overlay">
//       <div className="role-modal-content">
//         <div className="role-modal-header">
//           <h2>Add New Role</h2>
//           <button className="role-close-btn" onClick={onClose} title="Close">
//             &times;
//           </button>
//         </div>
//         <div className="role-modal-body">
//           <form onSubmit={handleSubmit} className="role-form">
//             <div className="form-group">
//               <label>Role Name</label>
//               <input
//                 type="text"
//                 value={roleName}
//                 onChange={(e) => setRoleName(e.target.value)}
//                 placeholder="Enter role name"
//               />
//             </div>
//             <div className="form-group">
//               <label>Permissions</label>
//               <div className="permissions-container">
//                 {permissions.length > 0 ? (
//                   permissions.map((perm, idx) => (
//                     <label key={idx} className="permission-label">
//                       <input
//                         type="checkbox"
//                         value={perm}
//                         checked={selectedPermissions.includes(perm)}
//                         onChange={handleCheckboxChange}
//                       />
//                       {perm}
//                     </label>
//                   ))
//                 ) : (
//                   <span className="no-permissions">No permissions available</span>
//                 )}
//               </div>
//             </div>
//             <div className="role-modal-actions">
//               <button type="submit">Add Role</button>
//               <button type="button" onClick={onClose}>
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddRoleModal;
