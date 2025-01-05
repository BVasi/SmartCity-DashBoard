import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { isJwtExpired } from './utils/JwtUtils';

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (isJwtExpired())
    {
      setAuth(false);
    }
    else
    {
      setAuth(true);
    }

    const interval = setInterval(() => {
      if (isJwtExpired())
      {
        setAuth(false);
      }
    }, 10 * 60 * 1000); //10 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<ProtectedRoute auth={auth} component={Home} />}
        />
        <Route
          path="/login"
          element={<Login setAuth={setAuth} />}
        />
        <Route
          path="/signup"
          element={<SignUp setAuth={setAuth} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
