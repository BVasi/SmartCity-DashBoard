import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ auth, component: Component }) {
  return auth ? <Component /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
