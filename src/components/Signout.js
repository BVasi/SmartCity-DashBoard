import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignOut = ({ setAuth }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('authToken');
    setAuth(false);
    navigate('/login');
  }, [navigate, setAuth]);

  return <div>Logging out...</div>;
};

export default SignOut;
