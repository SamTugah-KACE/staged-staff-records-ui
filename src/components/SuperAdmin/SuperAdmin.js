// src/components/SuperAdmin/SuperAdminLogin.js

import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Row,
  Col,
  Card,
  message,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UnlockOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/gi-kace-logo.png"; // Adjust this path if needed
import {toast} from 'react-toastify';
import api from "../request"; // Adjust the import path to your axios instance


const { Title, Text } = Typography;

const SuperAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // onFinish is called when form validation succeeds
  const onFinish = async (values) => {
    setLoading(true);
    const { username, password, securityKey, remember } = values;

    try {
      // Build URL-encoded body to match FastAPI's Form(...).
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("security_key", securityKey);
    formData.append("remember", remember ? "true" : "false");


    //   const response = await fetch(
    //     `${
    //       process.env.REACT_APP_API_BASE_URL || "http://localhost:8000"
    //     }/superadmin/auth/login`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //       },
    //       body: formData.toString(),
    //       credentials: "include",
    //     }
    //   );

    // Use your axios instance to POST to /superadmin/auth/login
      // Note: With baseURL (e.g. http://localhost:8000/api), 
      // this resolves to http://localhost:8000/api/superadmin/auth/login
      const response = await api.post(
        "/super-auth/superadmin/auth/login",
        formData.toString(),
        {
         withCredentials: true,
         headers: {
           // Override default interceptor so that FastAPI sees URL-encoded form fields:
           "Content-Type": "application/x-www-form-urlencoded",
         },
       }
     );


      if (!response.ok) {
        // Attempt to parse error detail from backend
        const data = await response.json().catch(() => ({}));
        const detail = data.detail || "Login failed. Please try again.";
        message.error(detail);
        setLoading(false);
        return;
      }

      const result = await response.json();
      // Store tokens—consider HttpOnly cookies in production
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("token_type", result.token_type);
      localStorage.setItem("username", result.username);
      if (remember) {
        localStorage.setItem("remember_me", "true");
      } else {
        localStorage.removeItem("remember_me");
      }

      // Example JSON: { "token_type": "bearer", "username": "superadmin", "dashboard_url": "/superadmin/dashboard" }
      message.success(`Welcome back, ${result.username}`);

      // Redirect to dashboard
      navigate(result.dashboard_url);
    } catch (err) {
      console.error("Login error:", err);
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // onFinishFailed is called when form validation fails
  const onFinishFailed = (errorInfo) => {
    // You can highlight or do something with the validation errors here
    console.log("Failed:", errorInfo);
    toast.error(errorInfo);
  };

  return (
   
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", background: "var(--background)" }}
    >
      <Col xs={22} sm={18} md={12} lg={8} xl={6}>
        <Card
          style={{
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            background: "var(--card-bg)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={3} style={{ margin: 0 }}>
              SuperAdmin Login
            </Title>
            <Text type="secondary">
              Enter your credentials including 2FA security key
            </Text>
          </div>

          <Form
            name="superadmin_login"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {/* Username */}
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please enter your username",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="superadmin"
                size="large"
              />
            </Form.Item>

            {/* Password with visibility toggle */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters",
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input.Password
                prefix={<UnlockOutlined />}
                placeholder="••••••••"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
              />
            </Form.Item>

            {/* 2FA Security Key with toggle */}
            <Form.Item
              label="Security Key (2FA)"
              name="securityKey"
              rules={[
                {
                  required: true,
                  message: "Please enter your security key",
                },
              ]}
            >
              <Input.Password
                prefix={<SafetyCertificateOutlined />}
                placeholder="••••••••"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
              />
            </Form.Item>

            {/* Remember Me */}
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember Me</Checkbox>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                {loading ? "Logging In..." : "Login"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
    
  );
};

export default SuperAdminLogin;
// Note: This code is a complete React component for a SuperAdmin login page.
// It uses Ant Design for UI components and handles form submission with validation.







// // src/components/SuperAdmin/SuperAdmin.js

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useNavigate } from "react-router-dom";

// // import {
// //   Card,
// //   CardHeader,
// //   CardTitle,
// //   CardDescription,
// //   CardContent,
// // } from "@/components/ui/card";
// // import { Label } from "@/components/ui/label";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { Icons } from "@/components/icons";

// import {
//    Card,
//    CardHeader,
//    CardTitle,
//    CardDescription,
//    CardContent,
//  } from "../ui/card";
//  import { Label } from "../ui/label";
//  import { Input } from "../ui/input";
//  import { Button } from "../ui/button";
//  import { Icons } from "../ui/icons";

// // ---------------------------------------------
// // 1) Define Zod schema exactly as before—no TS types needed
// // ---------------------------------------------
// const loginSchema = z.object({
//   username: z.string().min(1, "Username is required"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
//   security_key: z.string().min(1, "Security key is required"),
// });

// const SuperAdminLoginPage = () => {
//   // 2) useForm with zodResolver, but no <LoginFormInputs> generic
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//     mode: "onChange",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showKey, setShowKey] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);

//   const navigate = useNavigate();

//   // 3) The onSubmit handler stays exactly the same
//   const onSubmit = async (data) => {
//     setLoading(true);
//     setErrorMessage(null);

//     try {
//       const formData = new URLSearchParams();
//       formData.append("username", data.username);
//       formData.append("password", data.password);
//       formData.append("security_key", data.security_key);

//       const response = await fetch(
//         `${
//           process.env.REACT_APP_API_BASE_URL || "http://localhost:8000"
//         }/superadmin/auth/login`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: formData.toString(),
//           credentials: "include", // send cookies if backend sets any
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         setErrorMessage(
//           errorData.detail || "Login failed. Please try again."
//         );
//         setLoading(false);
//         return;
//       }

//       const result = await response.json();
//       // Store token locally (for production use HttpOnly cookie instead)
//       localStorage.setItem("access_token", result.access_token);
//       localStorage.setItem("token_type", result.token_type);
//       localStorage.setItem("username", result.username);

//       // Redirect to dashboard
//       navigate(result.dashboard_url);
//     } catch (error) {
//       console.error("Login error:", error);
//       setErrorMessage("An unexpected error occurred. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 4) JSX exactly as before, with Tailwind classes for responsiveness
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl">SuperAdmin Login</CardTitle>
//           <CardDescription>
//             Secure login for SuperAdmin accounts. Please enter your credentials.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Username */}
//             <div>
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 type="text"
//                 placeholder="Enter your username"
//                 {...register("username")}
//                 autoComplete="username"
//                 className="mt-1"
//               />
//               {errors.username && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {errors.username.message}
//                 </p>
//               )}
//             </div>

//             {/* Password w/ toggle */}
//             <div>
//               <Label htmlFor="password">Password</Label>
//               <div className="relative mt-1">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   {...register("password")}
//                   autoComplete="current-password"
//                   className="pr-10"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
//                   aria-label={
//                     showPassword ? "Hide password" : "Show password"
//                   }
//                 >
//                   {showPassword ? (
//                     <Icons.eyeOff className="h-5 w-5" />
//                   ) : (
//                     <Icons.eye className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Security Key w/ toggle */}
//             <div>
//               <Label htmlFor="security_key">Security Key (2FA)</Label>
//               <div className="relative mt-1">
//                 <Input
//                   id="security_key"
//                   type={showKey ? "text" : "password"}
//                   placeholder="Enter your security key"
//                   {...register("security_key")}
//                   autoComplete="one-time-code"
//                   className="pr-10"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowKey(!showKey)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
//                   aria-label={
//                     showKey ? "Hide security key" : "Show security key"
//                   }
//                 >
//                   {showKey ? (
//                     <Icons.eyeOff className="h-5 w-5" />
//                   ) : (
//                     <Icons.eye className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//               {errors.security_key && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {errors.security_key.message}
//                 </p>
//               )}
//             </div>

//             {/* Server Error Message */}
//             {errorMessage && (
//               <p className="text-sm text-center text-red-600">
//                 {errorMessage}
//               </p>
//             )}

//             {/* Submit */}
//             <div>
//               <Button
//                 type="submit"
//                 className="w-full flex justify-center"
//                 disabled={!isValid || loading}
//               >
//                 {loading && (
//                   <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
//                 )}
//                 {loading ? "Logging in..." : "Login"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SuperAdminLoginPage;
// // Note: Ensure you have the necessary icons in your Icons component
// // and that your Tailwind CSS setup is configured to handle the classes used here.