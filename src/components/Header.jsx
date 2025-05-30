import React, { useState,useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Bell, User, LogOut } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { getToken } from "firebase/messaging";
import { messaging } from "../../firebase-config.js";
import { onMessage } from "firebase/messaging";
import toast from "react-hot-toast";


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userData, handleLogout } = useContext(UserContext);
  const location = useLocation();

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  const [permissionGranted, setPermissionGranted] = useState(false);
  const requestPermission = async () => {
    try {
      // Check if notification permission is already granted
      const permission = Notification.permission;

      if (permission === "granted") {
        console.log("Notification permission already granted.");

        // Register the service worker with the correct scope
        if ("serviceWorker" in navigator) {
          // Register the service worker manually with the correct path
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );

          // Now, get the token with the custom service worker registration
          const currentToken = await getToken(messaging, {
            vapidKey:
              "BBMX-7-UVpvbl2ZhV8NdHkt9iEEZuwtC1CUz3iHpq0gwWLg_z4f2mtYG9M97vWDVwaRqLuYNuV4u-FElcTcwuTc", // Your VAPID key here
            serviceWorkerRegistration: registration, // Pass the custom service worker registration
          });

         
            console.log("FCM Token:", currentToken);
       console.log("User Data:", userData.id);

          if (currentToken && userData ) {
            console.log("FCM Token:", currentToken);
            const requestData = {
              user_id: userData.id,
              token: currentToken,
            };

            const response = await fetch(
              "http://localhost/gym_back/api/cron/saveFcmToken",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
              }
            );

            if (response.ok) {
              const result = await response.json();
              console.log("FCM token successfully saved:", result);
            } else {
              console.error(
                "Failed to save FCM token:",
                response.status,
                response.statusText
              );
            }
          } else {
            console.log("No registration token available.");
          }
        } else {
          console.error("Service Workers are not supported in this browser.");
        }
      } else if (permission === "default") {
        // Request permission if not already granted
        const permissionRequest = await Notification.requestPermission();
        if (permissionRequest === "granted") {
          console.log("Notification permission granted.");
          setPermissionGranted(true);
          requestPermission(); // Re-run the permission request logic after granting
        } else {
          console.log("Notification permission denied.");
        }
      } else {
        console.log("Notification permission denied.");
      }
    } catch (error) {
      console.error("Error getting notification permission or token:", error);
    }
  };
  useEffect(() => {
  requestPermission();

  onMessage(messaging, (payload) => {
    console.log("Message received: ", payload.notification);

    const data = payload.notification || {};
    const senderName = data.title || "Unknown";
    const rawMessage = data.body || "";

    const trimmedMessage = rawMessage.split(" ").slice(0, 7).join(" ");
    const initial = senderName.charAt(0).toUpperCase();

    toast.custom((t) => (
      <div
        className={`toast show align-items-center text-bg-light border-0 ${t.visible ? "fade-in" : "fade-out"}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ maxWidth: "400px", marginBottom: "1rem" }}
      >
        <div className="d-flex">
          <div className="toast-body d-flex align-items-center">
            <div
              className="rounded-circle bg-prime text-white d-flex align-items-center justify-content-center me-3"
              style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}
            >
              {initial}
            </div>
            <div>
              <strong className="me-1">{senderName}</strong>
              <div className="text-muted">{trimmedMessage}</div>
            </div>
          </div>
          <button
            type="button"
            className="btn-close me-2 m-auto"
            aria-label="Close"
            onClick={() => toast.dismiss(t.id)}
          ></button>
        </div>
      </div>
    ));
  });
}, []);

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-prime shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <Dumbbell size={24} className="me-2" />
            <span className="fw-bold">GYM ADMIN</span>
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent"
            aria-controls="navbarContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                  to="/"
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/members') ? 'active' : ''}`} 
                  to="/members"
                >
                  Members
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/plans') ? 'active' : ''}`} 
                  to="/plans"
                >
                  Plans and Prices
                </Link>
              </li>    
              
            </ul>
            
            <div className="d-flex align-items-center">
              <div className="dropdown me-3">
               
              
              </div>
              
              <div className="dropdown me-3">
                <a href="#" 
                  className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" 
                  id="userDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <div className="bg-white text-primary rounded-circle d-flex justify-content-center align-items-center me-2" style={{ width: '32px', height: '32px' }}>
                    <User size={18} />
                  </div>
                  <span>{userData?.username ? userData.username.charAt(0).toUpperCase()+userData.username.slice(1) : 'User'}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                 
                  
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <LogOut size={16} className="me-2" />
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;