import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-light py-3 mt-auto">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-center align-items-center">
          <p className="mb-0 text-muted">
            &copy; {currentYear} Gym Admin Dashboard. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;