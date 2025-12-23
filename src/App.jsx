import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register'; 
import Dashboard from './components/Dashboard';


const AuthLayout = ({ children }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            {children}
        </div>
    </div>
);

function App() {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('accessToken', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <Router>
      <Routes>
        {/* Protected Dashboard Route */}
        <Route path="/dashboard" element={
          token ? (
            <Dashboard token={token} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }/>
        
        {/* Login Route */}
        <Route path="/login" element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthLayout>
                <Login onLoginSuccess={handleLogin} />
            </AuthLayout>
          )
        }/>
        
        {/* Registration Route */}
        <Route path="/register" element={
            <AuthLayout>
                <Register />
            </AuthLayout>
        }/>
        
        {/* Default route redirects to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;