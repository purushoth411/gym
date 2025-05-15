import React, { createContext, useState, useEffect } from 'react';

// Create context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('gymAdminToken');
    const user = localStorage.getItem('gymAdminUser');
    
    if (token && user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('gymAdminToken');
    localStorage.removeItem('gymAdminUser');
    setIsLoggedIn(false);
    setUserData(null);
  };

  // Context value
  const value = {
    isLoggedIn,
    userData,
    handleLoginSuccess,
    handleLogout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;