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
          {/* Add more routes as needed */}
          <Route path="classes" element={<div className="container py-4"><h2>Classes Page</h2><p>Classes content coming soon...</p></div>} />
          <Route path="trainers" element={<div className="container py-4"><h2>Trainers Page</h2><p>Trainers content coming soon...</p></div>} />
          <Route path="reports" element={<div className="container py-4"><h2>Reports Page</h2><p>Reports content coming soon...</p></div>} />
          <Route path="profile" element={<div className="container py-4"><h2>Profile Page</h2><p>Profile content coming soon...</p></div>} />
          <Route path="settings" element={<div className="container py-4"><h2>Settings Page</h2><p>Settings content coming soon...</p></div>} />
          <Route path="activities" element={<div className="container py-4"><h2>Activities Page</h2><p>Activities content coming soon...</p></div>} />
          <Route path="terms" element={<div className="container py-4"><h2>Terms of Service</h2><p>Terms content coming soon...</p></div>} />
          <Route path="privacy" element={<div className="container py-4"><h2>Privacy Policy</h2><p>Privacy content coming soon...</p></div>} />
          <Route path="help" element={<div className="container py-4"><h2>Help Center</h2><p>Help content coming soon...</p></div>} />
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