import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignupPage from './components/SignupPage';
import SigninPage from './components/LoginPage'
import Dashboard from './components/snr_management/Dashboard';
import Staff from './components/staff/Staff';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage';
import { AuthProvider } from './context/AuthContext';
import SuperAdminLoginPage from './components/SuperAdmin/SuperAdmin';
import SuperAdminDashboard from './components/SuperAdmin/components/Organisations Table';
// import AlertNotifier from './components/AlertNotifier';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




// A simple hook to set a dark/light theme based on time
function useTheme() {
  useEffect(() => {
    const hour = new Date().getHours();
    // Example: if between 7am and 7pm use light theme, otherwise dark theme
    if (hour >= 7 && hour < 17) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  }, []);
}





function App() {
  // useTheme();
  return (
    <AuthProvider>
      {/* Global Toast Container for notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/:orgSlug/signin" element={<SigninPage />}   />
      {/* <Route path="/:orgSlug" element={<SigninPage />} /> */}
       {/* Add a route for the unauthorized page */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
       {/* Wrap protected routes */}
       <Route element={<ProtectedRoute />}>
          <Route path="/:orgSlug/dashboard" element={<Dashboard />} />
          <Route path="/:orgSlug/staff" element={<Staff />} />
          {/* Add more protected routes here */}
        </Route>
        {/* <Route path="/dev/dashboard" element={<SuperAdminDashboard />} /> */}
    
      {/* <Route path="/dashboard" element={<Dashboard />} />  */}
      <Route path="/oauth/login" element={<SuperAdminLoginPage />} />
 {/* <Route path="/staff" element={<Staff />} /> */}
    </Routes>
    {/** Add page not found ui */}
    {/* <Route path="*" element={<PageNotFound />} /> */}
     </AuthProvider>
  );

}

export default App;
