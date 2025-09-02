// src/components/Sidebar.js
import React, { useState } from 'react';
import './Sidebar.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import request from '../request';
import { toast } from 'react-toastify';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import ViewDepartmentsModal from '../snr_management/ViewDepartmentsModal'; // Import the modal
import UpdateDepartmentModal from '../snr_management/UpdateDepartmentModal';
import AddBranchModal from '../snr_management/AddBranchModal';
import UserFormBuilderModal from '../snr_management/CreateUserFormBuilder'; // Import the modal
import AddUserForm from '../snr_management/AddUserForm';
import BulkInsertUsersModal from '../snr_management/BulkInsertUserModal'; // Import the modal
import ExistingUsersModal from '../snr_management/ExistingUsersModal'; // Import the modal
import AddRoleModal from '../snr_management/AddRoleModal';



const Sidebar = ({ 
  // expanded,
  onToggle,
  activeMenu,
  setActiveMenu,
  onNewUserClick, 
  onNewDepartmentClick,
  onPromotionClick, 
  onNewBranchClick  
}) => {
  const [expanded, setExpanded] = useState(true);
  // const [activeMenu, setActiveMenu] = useState(null);

  const [showViewDeptModal, setShowViewDeptModal] = useState(false);
  const [showUpdateDeptModal, setShowUpdateDeptModal] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showUserFormBuilderModal, setShowUserFormBuilderModal] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showBulkInsertModal, setShowBulkInsertModal] = useState(false);
  const [showExistingUsersModal, setShowExistingUsersModal] = useState(false);
  

  const [showAddRoleModal, setShowAddRoleModal] = useState(false);


  // const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);

    // Retrieve orgSlug from the URL for multi-tenant navigation
    const { orgSlug } = useParams();
  const navigate = useNavigate();
  const { auth={}, logout } = useAuth() || {};
//   const auth = {
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjE0ZjIyMjUtZGQ1OC00NTk5LWJhOGMtNzg2YmI3YWM3MGY5IiwidXNlcm5hbWUiOiJzYW11ZWwua3VzaS1kdWFoQGdpLWthY2UuZ292LmdoIiwicm9sZV9pZCI6ImI0YjI3ZDMwLTQzYTEtNDBkYS04MzgzLWUzNmU1YzJjYjY0MiIsIm9yZ2FuaXphdGlvbl9pZCI6IjMzNWE3ZTNkLWI3MDEtNDkyMS05NjAyLTM1ZjMzMzBmYzk1MyIsImxvZ2luX29wdGlvbiI6InBhc3N3b3JkIiwiaWF0IjoxNzQ4ODU4NTc3Ljg4ODU1OCwibGFzdF9hY3Rpdml0eSI6MTc0ODg1ODU3Ny44ODg1NTgsImV4cCI6MTc0ODg2MjE3N30.JdQtGHHCGJnD_S3S77Z1tRtSUcv0sns5pRaevWisi7E",
//   "user":{"id":"a93ecc0a-a351-416b-93eb-72ec319b3dcc"}
// }
   const { organization = {} } = useOrganization();
  // const { organization } = useOrganization();
//  const orgId = organization?.id || '998a55ed-5598-432e-b6f4-b808c9838bcf';
  const isBranchManaged = organization?.nature?.toLowerCase().includes('branch');

  console.log("isBranch Managed: ", isBranchManaged);
  const toggleExpanded = () => setExpanded(!expanded);
  const toggleSubmenu = (menu) =>
    setActiveMenu((prev) => (prev === menu ? null : menu));

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  /** download function for downloading own data */
  const handleDownloadOwnData = async () => {
    try {
      const response = await request.get(
        `/download-employee-data/${auth.emp?.id}/download`,
        {
        params: { organization_id: auth.user?.organization_id }, // Pass the organization ID as a query parameter
        
        headers: { 
          'Authorization': `Bearer ${auth.token}` 
        },
       
       responseType: 'blob' // Ensure the response is treated as a blob for file download
      }
    );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link
        .href = url;
      link.setAttribute('download', `${auth.user?.username}_data.pdf`); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the link element
      toast.success('Your data has been downloaded successfully.');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download your data. Please try again.');
    }
  };



  const handleConfirmLogout = async () => {
    console.log("\n\norgSlug in logout function: ", orgSlug);
    try {
      console.log("\n\nuser's toekn: ",auth.token);
      // Call the backend logout API with the token in the header
      await request.post('/auth/logout', null, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      });

      logout();
    setShowLogoutModal(false);
    // Navigate to /:orgSlug/signin so that the slug remains in the URL
    navigate(`/${orgSlug}/signin`, { replace: true });

    } catch (error) {
      console.error('Logout API error:', error);
      // alert(error);
      toast.error('Logout failed. Please try again.');
      // Optionally, show an error message to the user
    }
    // Clear auth state and redirect to the organization's signin page
    
  };
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };


  return (
    <aside className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-btn" onClick={toggleExpanded}>
        {expanded ? '<<' : '>>'}
      </button>
      <ul className="menu-list">
        <li className="menu-item new-user-menu" onClick={() => toggleSubmenu('users')}>
          New User <span className="dropdown-indicator">▼</span>
          {expanded && activeMenu === 'users' && (
            <ul className="submenu">
              <li  className="add-new-user-menu" onClick={onNewUserClick}>Add New User</li>
              <li className="bulk-insert-menu" onClick={() => setShowBulkInsertModal(true)}>Bulk Insert Users</li>
              <li className="existing-users-menu" onClick={() => setShowExistingUsersModal(true)}>Existing Users</li>
              <li  className="user-registration-form-menu" onClick={() => setShowUserFormBuilderModal(true)}>User Registration Form</li>
            </ul>
          )}
        </li>
        <li className="menu-item" onClick={() => toggleSubmenu('roles')}>
          System Roles <span className="dropdown-indicator">▼</span>
          {expanded && activeMenu === 'roles' && (
            <ul className="submenu">
              <li onClick={() => setShowAddRoleModal(true)}>Add New Role</li>
              <li onClick={() =>  toast.info('Feature coming soon.')}>Existing Roles</li>
            </ul>
          )}
        </li>

          {isBranchManaged && (
          <li className="menu-item" onClick={() => toggleSubmenu('branch')}>
            Branch <span className="dropdown-indicator">▼</span>
            {expanded && activeMenu === 'branch' && (
              <ul className="submenu">
                <li onClick={() => setShowAddBranchModal(true)}>Add New Branch</li>
                <li onClick={() => toast.info('Feature coming soon.')}>View Branches</li>
                <li onClick={() => toast.info('Feature coming soon.')}>Assign Branch Manager</li>
                <li onClick={() => toast.info('Feature coming soon.')}>Update Branch</li>
                <li onClick={() => toast.info('Feature coming soon.')}>Delete Branch</li>
              </ul>
            )}
          </li>
        )}

        <li className="menu-item" onClick={() => toggleSubmenu('dept')}>
          Department <span className="dropdown-indicator">▼</span>
          {expanded && activeMenu === 'dept' && (
            <ul className="submenu">
              <li onClick={onNewDepartmentClick}>Add New Department</li>
              <li onClick={() => setShowViewDeptModal(true)}>View Departments</li>
              <li onClick={() => toast.info('Feature coming soon.')}>Assign Head of Department<br/>(HoD)</li>
              {isBranchManaged && (
                <li onClick={() => toast.info('Feature coming soon.')}>Assign Dept. a Branch</li>
                )}
              <li onClick={() =>  setShowUpdateDeptModal(true)}>Update Department</li>
              <li onClick={() => toast.info('Feature coming soon.')}>Delete Department</li>
            </ul>
          )}
        </li>
      
        <li className="menu-item" onClick={() => toggleSubmenu('promotion')}>
          Promotions <span className="dropdown-indicator">▼</span>
          {expanded && activeMenu === 'promotion' && (
            <ul className="submenu">
              <li onClick={() => toast.info('Feature coming soon.')}>Ranks</li>
              <li onClick={() => toast.info('Feature coming soon.')}>Policy</li>
              <li onClick={() => toast.info('Feature coming soon.')}>Applications</li>
            </ul>
          )}
        </li>

        {/** download button onclick pops-up sends request to /download-employee-data/{employee_id}/download and organizationId  */}
        <li className="menu-item" onClick={() => toggleSubmenu('reports')}>
          Reports <span className="dropdown-indicator">▼</span>
          {expanded && activeMenu === 'reports' && (
            <ul className="submenu">
              <li onClick={() => toast.info('Feature coming soon.')}>Employee Reports</li>
              <li onClick={() => toast.info('Feature coming soon.')}>Department Reports</li>
              {/** for organization.nature which is Branch Managed*/}
              {isBranchManaged && (
                <li onClick={() => toast.info('Feature coming soon.')}>Branch Reports</li>
              )}
          
              <li onClick={() => toast.info('Feature coming soon.')}>Promotion Reports</li>
              <li onClick={() => toast.info('Feature coming soon.')}>Attendance Reports</li>
              <li onClick={() => toast.info('Feature coming soon.')}>Payroll Reports</li>
              <li onClick={() => toast.info('Feature coming soon.')}>Leave Reports</li>
              <li onClick={() => toast.info('Feature coming soon.')}>Performance Reports</li>
              <li onClick={() => toast.info('Feature coming soon.')}>Custom Reports</li>
            </ul>
          )}
        </li>
        <li className="menu-item" onClick={() => toggleSubmenu('download')}>
          Download Data <span className="dropdown-indicator">▼</span>
          {expanded && activeMenu === 'download' && (
            <ul className="submenu">
              {/** create a function for download own data via api /download-employee-data/{employee_id}/download and organizationId */}

              <li onClick={handleDownloadOwnData}>Download Own Data</li>

              <li onClick={() => toast.info('Feature coming soon.')}>Download Employee Data</li>
              <li onClick={() => toast.info('Feature coming soon.')}>Download Department Data</li>
              <li onClick={() => toast.info('Feature coming soon.')}>Download Branch Data</li>
            </ul>
          )}
      </li>
      </ul>
      <div className="logout-container">
        <button className="logout-btn"  onClick={handleLogoutClick}>
          {expanded ? 'Log Out' : <span className="logout-icon">⎋</span>}
        </button>
      </div>
      {showLogoutModal && (
        <LogoutConfirmationModal
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}




{/* {showViewDeptModal && <ViewDepartmentsModal onClose={() => setShowViewDeptModal(false)} />}
      {showUpdateDeptModal && <UpdateDepartmentModal onClose={() => setShowUpdateDeptModal(false)} />}
      {showAddBranchModal && <AddBranchModal onClose={() => setShowAddBranchModal(false)} />} */}

    
    {
        showUserFormBuilderModal && (
          <UserFormBuilderModal
            organizationId={organization?.id || ''} // Pass the organization ID from context
            userId={auth.user?.id || ''}
            onClose={() => setShowUserFormBuilderModal(false)}
            onSaveSuccess={() => toast.success("Form saved successfully")}
          />
        )
    }

    {
        showAddUserForm && (
          <AddUserForm
            organizationId={organization?.id || ''} // Pass the organization ID from context
            userId={auth.user?.id || ''}  // Pass the user ID from auth context
            onClose={() => setShowAddUserForm(false)}
            onUserAdded={() => toast.success("User added.\nPlease prompt user to check his/her registered email for system credentials.")}
          />
        )
    }

    {showBulkInsertModal && (
        <BulkInsertUsersModal
          organizationId={organization?.id || ''}
          onClose={() => setShowBulkInsertModal(false)}
          onSuccess={() => toast.success("Users inserted successfully")}
        />
      )}

      {showExistingUsersModal && (
        <ExistingUsersModal
          organizationId={organization?.id || ''}
          onClose={() => setShowExistingUsersModal(false)}
        />
      )}

      {
        showAddRoleModal && (
          <AddRoleModal
            organizationId={organization?.id || ''}
            onClose={() => setShowAddRoleModal(false)}
            onRoleAdded={() => toast.success("Role added successfully.")}
          />
        )
      }

     {showUpdateDeptModal && (
        <UpdateDepartmentModal onClose={() => setShowUpdateDeptModal(false)} 
        onDepartmentUpdated={() => toast.success("Department Updated successfully")}

        />
      )}

      {showViewDeptModal && (
        <ViewDepartmentsModal onClose={() => setShowViewDeptModal(false)} 
        />
      )}

      {showAddBranchModal && (
        <AddBranchModal
          onClose={() => setShowAddBranchModal(false)}
          onBranchAdded={() => toast.success("Branch added successfully")}
        />
      )}
    </aside>
  );
};

export default Sidebar;







