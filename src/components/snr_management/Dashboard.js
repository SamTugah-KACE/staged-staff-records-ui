import React, { useState, useEffect } from 'react';
import Header from '../pages/Header';
import Footer from '../Footer';
import Sidebar from '../pages/Sidebar';
import SearchBar from '../pages/SearchBar';
import SummaryCards from '../pages/SummaryCards';
import DashboardTable from '../pages/DashboardTable';
import NewUserModal from '../pages/NewUserModal';
import AddUserForm from './AddUserForm';
import AddDepartmentModal from './AddDepartmentModal';
import UpdateDepartmentModal from './UpdateDepartmentModal';
import AddBranchModal from './AddBranchModal';
import './Dashboard.css';
import ProfileCard from '../pages/ProfileCard';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { useOrganizationSummary } from '../../hooks/useOrganizationSummary';
import TourGuide from '../guide/TourGuide';
import useSummaryData from '../../hooks/useSummaryData';
import Slider  from 'react-slick';
import { toast } from 'react-toastify';


const Dashboard = () => {

const { auth } = useAuth();

// const [summaryData, setSummaryData] = useState(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showUpdateDeptModal, setShowUpdateDeptModal] = useState(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  // Lifted sidebar submenu state so TourGuide can open it programmatically
  const [activeMenu, setActiveMenu] = useState(null);
  

 const staffId = auth.emp && auth.emp.id;
const userId = auth.user && auth.user.id;
  const { organization } = useOrganization();           // assume you have this
  const orgId = organization?.id;
  console.log("\n\norg_id: ", orgId);
  console.log("\n\nstaff_id: ", staffId);
  console.log("\n\nuser_id: ", userId);

  // const orgId = "298e49e5-441a-4b3d-8769-008e0358b1a6";
  // const { summary, isLoading: loadingSummary, error: summaryError } = useOrganizationSummary(orgId);
  const { data, loading, error} = useSummaryData(orgId, userId);

  console.log("data: ", data);
  console.log("\n\nloading:: ", loading);

  // Define the tour steps. The target selectors must match unique CSS classes set in your components.
  const tourSteps = [
    { target: '.dashboard-header', content: 'This is your dashboard header.' },
    { target: '.sidebar',        content: 'Use this sidebar to navigate.' },
    { target: '.new-user-menu',  content: 'Here are the New User options.' },
    { target: '.bulk-insert-menu', content: 'Bulk insert many users here.' },
    { target: '.user-registration-form-menu', content: "Design your registration form.\nNote: First Name, Last Name, and Email are required fields." },
    { target: '.add-new-user-menu', content: 'Add one new user here.' },
    { target: '.existing-users-menu', content: 'View existing users here.' },
  ];

  // When Joyride is about to show a deeper submenu step, expand it
  const handleTourEvent = (datum) => {
    // if (data.type === 'step:before' && data.index >= 3 && data.index <= 6) {
      // steps 3–6 are inside the New User submenu
      setActiveMenu('users');
    // }
  };

  // When the tour is finished or skipped, close any open menus
  const handleTourEnd = () => {
    setActiveMenu(null);
    
  };


  // slider config for “other panels” (e.g. table)
  const panelSettings = {
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    arrows: true,
  };

  
  console.log("data: ", data);

  useEffect(() => {
  if (data) {
    console.log("Summary data updated:", data);
  }
}, [data]);
  
  // if (error)   return <div className="error">Error loading summary. <p>{error}</p></div>;

  return (
    <div className="dashboard-frame">
      <TourGuide
        steps={tourSteps}
        user_id = {userId}
        // authToken={auth.token}
        onStepCallback={handleTourEvent}
        onTourEnd={handleTourEnd}
      />

      <Header className="dashboard-header" onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="dashboard-body"
      //  style={{ '--sidebar-width': sidebarExpanded ? '250px' : '60px' }}
       >
        {/* <aside className="sidebar"> */}
          <Sidebar
          expanded={sidebarExpanded}
           onToggle={() => setSidebarExpanded(!sidebarExpanded)}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            onNewUserClick={()=>setShowNewUserModal(true)}
            onNewDepartmentClick={()=>setShowAddDeptModal(true)}
            onUpdateDepartmentClick={()=>setShowUpdateDeptModal(true)}
            onNewBranchClick={()=>setShowAddBranchModal(true)}
          />
        {/* </aside> */}

        <main className="main-content">
            {sidebarExpanded && window.innerWidth <= 768 && (
    <div 
      className="mobile-overlay"
      onClick={() => setSidebarExpanded(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 800
      }}
    />
  )}
          <ProfileCard className="dashboard-profile" />
          <SearchBar className="dashboard-search" />

          <div className="cards-wrapper">
    <SummaryCards data={data} loading={loading} error={error} /> 
          </div>


         {/* wrap table (and future panels) in a slider */}
         <div className="panel-slider">
            <Slider {...panelSettings}>
              <div>
                <DashboardTable orgId={orgId} token={auth.token} />
              </div>
              {/* e.g. future panel */}
              {/* <div><OtherWidget /></div> */}
            </Slider>
          </div>


        </main>
      </div>

      <Footer className="dashboard-footer" />

            {/* Modals */}
      {/* {showNewUserModal && (
        <NewUserModal 
        organizationId={orgId}
      userId={userId}
        onClose={() => setShowNewUserModal(false)} 
        onUserAdded={() => {
        toast.success('User created! Check their email for credentials.');
        setShowNewUserModal(false);
      }}
        />
        )} */}

        {showNewUserModal && (
  <AddUserForm
    organizationId={orgId}
    userId={userId}
    onClose={() => setShowNewUserModal(false)}
    onUserAdded={() => {
      toast.success("User added.\nPlease prompt user to check his/her registered email for system credentials.");
      setShowNewUserModal(false);
    }}
  />
)}




      {showAddDeptModal && (<AddDepartmentModal 
      onClose={() => setShowAddDeptModal(false)} 
      onDepartmentAdded={(newDept) => {
      toast.success('Department added successfully!');
      // …and maybe refresh your department list/table here…
    }}
      /> )}
      {showUpdateDeptModal && (
        <UpdateDepartmentModal
          onClose={() => setShowUpdateDeptModal(false)}
        />
      )}
      {showAddBranchModal && (
        <AddBranchModal
          onClose={() => setShowAddBranchModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
















// import React, { useState } from 'react';
// import Header from '../pages/Header';
// import Footer from '../Footer';
// import Sidebar from '../pages/Sidebar';
// import SearchBar from '../pages/SearchBar';
// import SummaryCards from '../pages/SummaryCards';
// import DashboardTable from '../pages/DashboardTable';
// import NewUserModal from '../pages/NewUserModal';
// import AddDepartmentModal from './AddDepartmentModal';
// import UpdateDepartmentModal from './UpdateDepartmentModal';
// import AddBranchModal from './AddBranchModal';
// import './Dashboard.css';
// import ProfileCard from '../pages/ProfileCard';
// // import Joyride from 'react-joyride';
// // import { useOrganization } from '../../context/OrganizationContext';
// import { useAuth } from '../../context/AuthContext';
// import TourGuide from '../guide/TourGuide';

// const Dashboard = () => {

// const { auth } = useAuth();
//   const [showNewUserModal, setShowNewUserModal] = useState(false);
//   const [showAddDeptModal, setShowAddDeptModal] = useState(false);
//   const [showUpdateDeptModal, setShowUpdateDeptModal] = useState(false);
//   const [showAddBranchModal, setShowAddBranchModal] = useState(false);

//   // Lifted sidebar submenu state so TourGuide can open it programmatically
//   const [activeMenu, setActiveMenu] = useState(null);
  
//   // Define the tour steps. The target selectors must match unique CSS classes set in your components.
//   const tourSteps = [
//     {
//       target: '.dashboard-header',
//       content: 'This is your dashboard header where notifications and the title are displayed.',
//     },
//     {
//       target: '.sidebar',
//       content: 'Use this sidebar to navigate between different modules.',
//     },
//     {
//       target: '.new-user-menu',
//       content: 'Click here to access the New User options.',
//     },
//     {
//       target: '.bulk-insert-menu',
//       content: 'This option lets you perform a bulk insert of users.',
//       // orphan: true, // if the element is not mounted by default
//     },
//     {
//       target: '.user-registration-form-menu',
//       content: 'Design and edit the User Registration Form here.\nNote: whiles you create the user registration form, it is compulsory to create fields for the following items: \n- First Name, \n - Last Name, and Email.',
//       // orphan: true, // if the element is not mounted by default
//     },
//     {
//       target: '.add-new-user-menu',
//       content: 'Use this option to add a new user directly.',
//       // orphan: true, // if the element is not mounted by default
//     },
//     {
//       target: '.existing-users-menu',
//       content: 'Click here to view the list of existing users.',
//       // orphan: true, // if the element is not mounted by default
//     },
//     // Add further steps as needed.
//   ];

//   // When Joyride is about to show a deeper submenu step, expand it
//   const handleTourEvent = (data) => {
//     if (data.type === 'step:before' && data.index >= 3 && data.index <= 6) {
//       // steps 3–6 are inside the New User submenu
//       setActiveMenu('users');
//     }
//   };

//   // When the tour is finished or skipped, close any open menus
//   const handleTourEnd = () => {
//     setActiveMenu(null);
//     // setShowNewUserModal(false);
//     // setShowAddDeptModal(false);
//     // setShowUpdateDeptModal(false);
//     // setShowAddBranchModal(false);
//   };

//   const handleDepartmentAdded = (newDept) => {
//     // Update your state or refresh the department list as needed.
//     console.log("New department added:", newDept);
//   };


//   const handleDepartmentUpdated = (newDept) => {
//     // Update your state or refresh the department list as needed.
//     console.log("Department Updated:", newDept);
//   };

  
//   const handleBranchAdded = (newBranch) => {
//     console.log("New branch added:", newBranch);
//     // Refresh the branch list as needed.
//   };

//   return (
//     <div className="dashboard-container">

//       {/* Pass the auth token into TourGuide for API calls */}
//       <TourGuide 
//       steps={tourSteps} 
//       authToken={auth.token}
//       onStepCallback={handleTourEvent}
//       onTourEnd={handleTourEnd}
//       />

//       <Header  />
//       <ProfileCard /> {/* Positioned immediately below header */}

//       <div className="dashboard-content">
//         <Sidebar 
//         activeMenu={activeMenu}
//         setActiveMenu={setActiveMenu}
//         onNewUserClick={() => setShowNewUserModal(true)} 
//         onNewDepartmentClick={() => setShowAddDeptModal(true)}
//         onUpdateDepartmentClick={() => setShowUpdateDeptModal(true)}
//         onNewBranchClick={() => setShowAddBranchModal(true)}
//           />
//         <main className="main-panel">
//           <SearchBar />
//           <SummaryCards />
//           <DashboardTable />
//         </main>
//       </div>
//       {showNewUserModal && (
//         <NewUserModal onClose={() => setShowNewUserModal(false)} />
//       )}

//      {showAddDeptModal && (
//         <AddDepartmentModal
//           onClose={() => setShowAddDeptModal(false)}
//           onDepartmentAdded={handleDepartmentAdded}
//         />
//       )}

//       {showUpdateDeptModal && (
//         <UpdateDepartmentModal
//           onClose={() => setShowUpdateDeptModal(false)}
//           onDepartmentUpdated={handleDepartmentUpdated}
//         />
//       )}
      
//       {showAddBranchModal && (
//         <AddBranchModal
//           onClose={() => setShowAddBranchModal(false)}
//           onBranchAdded={handleBranchAdded}
//         />
//       )}

//       <Footer />
//     </div>

    
//   );
// };

// export default Dashboard;


