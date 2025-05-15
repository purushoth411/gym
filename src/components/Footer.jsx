import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-light py-3 mt-auto">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <p className="mb-0 text-muted">
            &copy; {currentYear} Gym Admin Dashboard. All rights reserved.
          </p>
          <ul className="nav">
            <li className="nav-item">
              <Link to="/terms" className="nav-link px-2 text-muted">Terms</Link>
            </li>
            <li className="nav-item">
              <Link to="/privacy" className="nav-link px-2 text-muted">Privacy</Link>
            </li>
            <li className="nav-item">
              <Link to="/help" className="nav-link px-2 text-muted">Help</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;