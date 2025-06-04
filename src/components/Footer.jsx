import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className=" py-3 mt-auto bg-prime">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-center align-items-center">
          <p className="mb-0 text-light">
            &copy; {currentYear} PK FITNESS. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;