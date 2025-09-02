import React from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useValidateSlug from '../hooks/useValidateSlug';
import UnauthorizedPage from './UnauthorizedPage';


const ProtectedRoute = () => {
  const { auth } = useAuth();
  const location = useLocation();

  const { orgSlug } = useParams();
  const { loading, org, error } = useValidateSlug(orgSlug);

  // While validating the slug, you can show a loading indicator.
  if (loading) return <div>Loading organization info...</div>;
  
  // If the slug is invalid, show an error page.
  if (error) return <UnauthorizedPage message={`This site can't be reached.`} />;

  // If no token, redirect to /signin (optionally preserving location for redirect after login)
  return auth.token ? <Outlet /> : <Navigate to={`/${orgSlug}/signin`} replace state={{ from: location }} />;
};

export default ProtectedRoute;
