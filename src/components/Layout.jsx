import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import bgImage from "../assets/bg.jpg"; // ✅ Make sure this path is correct

const Layout = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1f4b8b',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Dark Overlay */}
      <div
        
      />

      {/* Page Content */}
      <div
        style={{ position: "relative", zIndex: 1 }}
        className="d-flex flex-column min-vh-100 text-white"
      >
        <Header />
        <div className="flex-grow-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
