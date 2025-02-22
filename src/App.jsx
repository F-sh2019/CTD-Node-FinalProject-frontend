import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import './App.css';

import { Home, Courses, RegisterUser, Registration, Search, UserManagement, Login } from "./pages";

function App() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check localStorage on app load
    
    const authStatus = localStorage.getItem("auth") ;
    console.log(authStatus);
    setIsAuthenticated(authStatus);
    console.log(authStatus);
  }, []);

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          {/* Redirect all routes to login if not authenticated */}
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/search" element={<Search />} />
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/login" element={<Navigate to="/" />} /> {/* Redirect logged-in users */}
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
