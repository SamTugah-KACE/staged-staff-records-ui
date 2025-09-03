// src/components/LoginPage.js
import React, { useEffect, useState } from 'react';
import './LoginPage.css';
import request from './request';
import { useParams, useNavigate } from 'react-router-dom';
import FacialAuth from './FacialAuth';
import useValidateSlug from '../hooks/useValidateSlug';
import { useAuth } from '../context/AuthContext';
import { useOrganization } from '../context/OrganizationContext';
import stockPhoto from '../assets/images/stock-photo.jpg'; // Import the default background image
import { toast } from 'react-toastify';
import {Spin} from 'antd';

const LoginPage = () => {
  const navigate = useNavigate();
  const { orgSlug } = useParams();
  const { loading: slugLoading, org, error: slugError } = useValidateSlug(orgSlug);

  // Debug logging
  console.log("\n🔐 LoginPage rendered with:");
  console.log("orgSlug:", orgSlug);
  console.log("slugLoading:", slugLoading);
  console.log("org:", org);
  console.log("slugError:", slugError);
  console.log("Current URL:", window.location.href);
  console.log("Current domain:", window.location.origin);

  const { login } = useAuth();
  const { setOrgData } = useOrganization();

 
  
  const [orgLogo, setOrgLogo] = useState(null);
  const [loginMode, setLoginMode] = useState("password"); // "password" or "facial"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [facialImage, setFacialImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // On mount (or when org data is available), try to get the logo:
  useEffect(() => {
    if (org) {
      setOrgData(org);
    // Try localStorage first
    let logo = localStorage.getItem('orgLogo');
    if (!logo && org && org.logos) {
      // org.logos is a dictionary; choose one of the logos (for example, the first one)
      const logos = Object.values(org.logos);
      if (logos.length > 0) {
        logo = logos[0];
        // Optionally store it for future visits:
        localStorage.setItem('orgLogo', logo);
      }
    }
    if (logo) {
      // setOrgLogo(logo);
      const safeLogoUrl = logo ? encodeURI(logo) : null;
      console.log("safe logo uirl: ", safeLogoUrl)
     setOrgLogo(encodeURI(logo));
     console.log("\norgLogo: ", orgLogo)
    //  console.log("\nencodinURL: ", encodeURI(orgLogo))
    }
  }
  }, [org, setOrgData]);


  if (slugLoading) return <div>Loading organization info...</div>;
  if (slugError) return <div style={{ padding: '40px', textAlign: 'center',  fontSize: '18px', color: 'red' }}>
    {/* Display a more user-friendly error message */}
    <h1 style={{ color: 'red' }}>This site can't be reached</h1>
    <p style={{ color: 'black' }}>
    {`The organization with slug "${orgSlug}" could not be found.
    Please check the URL for typos or contact your Systems Administrator for assistance.`}
    </p>
    {/* Optionally, you can provide a link to go back or to the home page */}
    <p style={{ color: 'black' }}>
    <a href="/" style={{ color: 'blue' }}>Go to Home Page</a>
    </p>
    {/* If you want to display the slugError message, you can do so */}
    <div style={{ color: 'black', marginTop: '20px' }}>
    <p>{slugError}</p>
    </div>
    {/* <h1>This site can't be reached</h1> */}
    
    {/* {slugError} */}
    
    </div>;
  
  // Add a safeguard in case org is still null (should not happen if slugError is false)
  if (!org) return <div style={{ padding: '40px', textAlign: 'center', color:'black' }}>No organization information available.</div>;

  // Use a fallback for org.name if org is null.
  const organizationName = org?.name || "";
 
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username) {
      // alert("Username is required.");
      toast.error("Username is required.");
      return;
    }

    setLoading(true);
    let formData = new FormData();
    formData.append("username", username);

    let url = "/auth/login"; // Base endpoint


    if (loginMode === "password") {
      if (!password) {
        // alert("Password is required for traditional login.");
        toast.error("Password is required for traditional login.");
        setLoading(false);
        return;
      }
      formData.append("password", password);
       // If your backend expects the password as a query parameter, append it here
      //  url += `?password=${encodeURIComponent(password)}`;
       // Do NOT append password to formData in this case.
    } else {
      if (!facialImage) {
        // alert("Please capture your facial image for authentication.");
        toast.error("Please capture your facial image for authentication.");
        setLoading(false);
        return;
      }
      // Convert facialImage dataURL to Blob then File
      const blob = await (await fetch(facialImage)).blob();
      const file = new File([blob], "facial.jpg", { type: blob.type });
      formData.append("facial_image", file);
    }

    try {
      // const response = await request.post("/auth/login", formData, {
      //   headers: { "Content-Type": "multipart/form-data" }
      // });
      // const response = await request.post("/auth/login", formData);

      const response = await request.post(url, formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        });
      // Assume the API returns a token and user info
      
      console.log("\nlogin response: ", response);
      console.log("\nlogin response.data: ", response.data);
      const { token, user, name, role, staff } = response.data;
      login(token, user, name, role, staff);
      // In LoginPage.js, after successful login:
       localStorage.setItem('orgData', JSON.stringify(org));


      

       // Decide which dashboard to navigate to based on user's permissions.
      // Adjust these keys as per your backend response.
      let targetRoute = "";
      const perms = response.data.permissions || {};
      console.log("perms: ", perms);
      console.log("is_admin: ", perms.admin);
      if (
        perms.includes("hr:dashboard") 
       
      ) {
        targetRoute = "/dashboard";
      } else if (
        perms.includes("staff:dashboard")
      ) {
        targetRoute = "/staff";
      }else if (
        perms.view_security_logs ||
        perms.systems_administration
      ) {
        targetRoute = "/systems";
      } 
      // Navigate to the appropriate route using the orgSlug and replace the history entry.
      navigate(`/${orgSlug}${targetRoute}`, { replace: true });


      




      // navigate(`/${orgSlug}/dashboard`, { replace: true }); 
      // navigate(`/${orgSlug}/dashboard`, {state: {org} });

    } catch (error) {
      console.log("\n\nlogin failed with error: ", error.message);
      toast.error("Login failed: " + error.message);
      // alert("Login failed: " + error.message);
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" 
    style={{
      backgroundImage: orgLogo 
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${orgLogo})`
          : `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${stockPhoto})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="login-container">
        <h2> {organizationName}</h2>
        <form onSubmit={handleLogin}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div className="login-mode-toggle">
            <label>
              <input
                type="radio"
                value="password"
                checked={loginMode === "password"}
                onChange={() => setLoginMode("password")}
              /> Password
            </label>
            <label>
              <input
                type="radio"
                value="facial"
                checked={loginMode === "facial"}
                onChange={() => setLoginMode("facial")}
              /> Facial Authentication
            </label>
          </div>

          {loginMode === "password" ? (
            <>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          ) : (
            <FacialAuth onCapture={setFacialImage} />
          )}

          <button type="submit" className="login-btn" disabled={loading}>
          {/* The wrapper ensures that the button size remains fixed */}
          <span className="btn-content">
          {loading ? <Spin size="small" /> : "Login"}
          </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;






// // src/components/LoginPage.js
// import React, { useState, useRef } from 'react';
// import './LoginPage.css';
// import request from './request';
// import { useNavigate } from 'react-router-dom';
// import Webcam from 'react-webcam';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [loginMode, setLoginMode] = useState("password"); // "password" or "facial"
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [capturedImage, setCapturedImage] = useState(null);
//   const webcamRef = useRef(null);

//   const videoConstraints = {
//     width: 300,
//     height: 300,
//     facingMode: "user"
//   };

//   const captureImage = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCapturedImage(imageSrc);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!username) {
//       alert("Username is required.");
//       return;
//     }
//     let formData = new FormData();
//     formData.append("username", username);
//     if (loginMode === "password") {
//       if (!password) {
//         alert("Password is required for traditional login.");
//         return;
//       }
//       formData.append("password", password);
//     } else {
//       if (!capturedImage) {
//         alert("Please capture your facial image for authentication.");
//         return;
//       }
//       // Convert captured image (data URL) to Blob and then File
//       const blob = await (await fetch(capturedImage)).blob();
//       const file = new File([blob], "facial.jpg", { type: blob.type });
//       formData.append("facial_image", file);
//     }

//     try {
//       const response = await request.post("/login", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       // On success, navigate to dashboard
//       navigate("/dashboard");
//     } catch (error) {
//       alert("Login failed: " + error.message);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <h2>Sign In</h2>
//         <form onSubmit={handleLogin}>
//           <label>Username:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />

//           <div className="login-mode-toggle">
//             <label>
//               <input
//                 type="radio"
//                 value="password"
//                 checked={loginMode === "password"}
//                 onChange={() => setLoginMode("password")}
//               /> Password
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 value="facial"
//                 checked={loginMode === "facial"}
//                 onChange={() => setLoginMode("facial")}
//               /> Facial Authentication
//             </label>
//           </div>

//           {loginMode === "password" ? (
//             <>
//               <label>Password:</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </>
//           ) : (
//             <div className="facial-auth">
//               <Webcam
//                 audio={false}
//                 ref={webcamRef}
//                 screenshotFormat="image/jpeg"
//                 videoConstraints={videoConstraints}
//                 className="webcam-video"
//               />
//               <button type="button" onClick={captureImage} className="capture-btn">
//                 {capturedImage ? "Re-capture" : "Capture"}
//               </button>
//               {capturedImage && (
//                 <img src={capturedImage} alt="Captured" className="captured-image" />
//               )}
//             </div>
//           )}

//           <button type="submit" className="login-btn">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
