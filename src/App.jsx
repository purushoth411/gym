import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './components/Dashboard';
import Members from './components/members/index';
import PlansAndPrices from './components/PlansAndPrices';
import Layout from './components/Layout';
import { UserProvider, UserContext } from './context/UserContext';
import { Toaster } from 'react-hot-toast';
// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(UserContext);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function MainApp() {
  const { isLoggedIn } = useContext(UserContext);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} 
        />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="plans" element={<PlansAndPrices />} />
        
        </Route>
        
        {/* Catch all - 404 */}
        <Route path="*" element={
          <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/" className="btn btn-primary">Go to Dashboard</a>
          </div>
        } />
      </Routes>

      
    </BrowserRouter>
    
  );
}

function App() {
  return (
    <UserProvider>
      <MainApp />
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
        // Define default options
        className: 'border',
        duration: 3000,
        removeDelay: 500,
        style: {
          background: '#161616FF',
          color: '#fff',
        },

        // Default options for specific types
        success: {
          duration: 3000,
          iconTheme: {
            primary: 'green',
            secondary: 'black',
          },
        },
      }} />
    </UserProvider>
  );
}

export default App;