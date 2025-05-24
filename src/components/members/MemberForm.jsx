// components/members/MemberForm.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

const MemberForm = ({ isEdit, currentMember, handleInputChange, onSubmit, onClose }) => {
  // Animation variants
  const slideInVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { 
        ease: 'easeInOut', 
        duration: 0.3 
      } 
    }
  };

  return (
    <motion.div 
      className="form-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <motion.div 
        className="form-panel"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideInVariants}
        style={{
          width: '500px',
          maxWidth: '100%',
          height: '100%',
          background: 'white',
          boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          overflowY: 'auto'
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">{isEdit ? 'Edit Member' : 'Add New Member'}</h5>
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        
        <form onSubmit={onSubmit} id="memberForm">
          <div className="row g-3">
            {/* Personal Information */}
            <div className="col-md-6">
              <label htmlFor="first_name" className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                value={currentMember.first_name || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="last_name" className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                value={currentMember.last_name || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                className="form-select"
                id="gender"
                name="gender"
                value={currentMember.gender || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                id="date_of_birth"
                name="date_of_birth"
                value={currentMember.date_of_birth || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Contact Information */}
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={currentMember.phone || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="alt_phone" className="form-label">Alternate Phone</label>
              <input
                type="tel"
                className="form-control"
                id="alt_phone"
                name="alt_phone"
                value={currentMember.alt_phone || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={currentMember.email || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Photo Upload */}
            <div className="col-md-12">
              <label htmlFor="photo" className="form-label">Photo</label>
              {currentMember.photo && (
                <div style={{ marginBottom: '10px' }}>
                  <img 
                    src={`http://localhost/gym_back/uploads/profile_photo/${currentMember.photo}`}
                    alt="Existing Photo" 
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                  />
                </div>
              )}
              <input
                type="file"
                className="form-control"
                id="photo"
                name="photo"
                onChange={handleInputChange}
                accept="image/*"
              />
            </div>

            {/* Additional Information */}
            <div className="col-12">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                rows="2"
                value={currentMember.address || ''}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="col-md-6">
              <label htmlFor="medical_info" className="form-label">Medical Information</label>
              <textarea
                className="form-control"
                id="medical_info"
                name="medical_info"
                rows="2"
                value={currentMember.medical_info || ''}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="col-md-6">
              <label htmlFor="join_date" className="form-label">Join Date</label>
              <input
                type="date"
                className="form-control"
                id="join_date"
                name="join_date"
                value={currentMember.join_date || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={currentMember.status || '1'}
                onChange={handleInputChange}
                required
              >
                <option value="1">Active</option>
                <option value="2">Inactive</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-4 d-flex justify-content-end">
            <button type="button" className="btn btn-outline-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} className="me-1" />
              {isEdit ? 'Update Member' : 'Save Member'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MemberForm;