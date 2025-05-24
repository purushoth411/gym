import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, Search, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMember, setCurrentMember] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    phone: '',
    alt_phone:'',
    email: '',
    address: '',
    medical_info: '',
    join_date: '',
    status: '1'
  });

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost/gym_back/api/members');
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        setMembers(data);
        setError(null);
      } catch (err) {
        setError('Error loading members: ' + err.message);
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleInputChange = (e) => {
    const { name, type, files, value } = e.target;
  
    setCurrentMember(prevState => ({
      ...prevState,
      [name]: type === 'file' ? files[0] : value
    }));
  };
  

  // Handle form input changes
  const handleAddMember = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    // Append all fields including file
    for (let key in currentMember) {
      if (currentMember[key] !== undefined && currentMember[key] !== null) {
        formData.append(key, currentMember[key]);
      }
    }
  
    try {
      const response = await fetch('http://localhost/gym_back/api/members/add', {
        method: 'POST',
        body: formData, // no need to set headers
      });
  
      const result = await response.json();
  
      if (result.status && result.member) {
        setMembers(prevMembers => [...prevMembers, result.member]);
        resetForm();
        setShowAddForm(false);
      } else if (result.errors) {
        setError('Validation error: ' + result.errors);
      } else {
        setError('Something went wrong while adding member.');
      }
    } catch (err) {
      setError('Error adding member: ' + err.message);
      console.error('Error adding member:', err);
    }
  };
  
  

  // Handle edit member form submission
  const handleUpdateMember = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    // Append all fields including file
    for (let key in currentMember) {
      if (currentMember[key] !== undefined && currentMember[key] !== null) {
        formData.append(key, currentMember[key]);
      }
    }
  
    try {
      const response = await fetch(`http://localhost/gym_back/api/members/update/${currentMember.id}`, {
        method: 'POST', // change to POST for FormData
        body: formData,
      });
  
      const result = await response.json();
  
      if (!response.ok || !result.status) {
        throw new Error(result.message || 'Failed to update member');
      }
  
      const updated = result.member;
  
      setMembers(prevMembers =>
        prevMembers.map(member => member.id === updated.id ? updated : member)
      );
  
      resetForm();
      setShowEditForm(false);
    } catch (err) {
      setError('Error updating member: ' + err.message);
      console.error('Error updating member:', err);
    }
  };
  
  

  // Handle delete member
  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        const response = await fetch(`http://localhost/gym_back/api/members/delete/${id}`, {
          method: 'DELETE',
        });
  
        const result = await response.json();
  
        if (!response.ok || !result.status) {
          throw new Error(result.message || 'Failed to delete member');
        }
  
        setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
      } catch (err) {
        setError('Error deleting member: ' + err.message);
        console.error('Error deleting member:', err);
      }
    }
  };
  

  // Reset form fields
  const resetForm = () => {
    setCurrentMember({
      first_name: '',
      last_name: '',
      gender: '',
      date_of_birth: '',
      phone: '',
      email: '',
      address: '',
      medical_info: '',
      join_date: '',
      status: '1'
    });
  };

  // Edit member
  const editMember = (member) => {
    setCurrentMember({...member});
    setShowEditForm(true);
    setShowAddForm(false);
  };

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm)
  );

  // Animation variants for the form panel
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

  // Backdrop animation
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Member form component - directly access state without memoization
  const renderMemberForm = (isEdit, onSubmit) => {
    const closeForm = () => {
      if (isEdit) {
        setShowEditForm(false);
      } else {
        setShowAddForm(false);
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
              onClick={closeForm}
            ></button>
          </div>
          <form onSubmit={onSubmit} id="memberForm">
            <div className="row g-3">
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
                  required
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
              <div className="col-md-12">
  <label htmlFor="photo" className="form-label">Photo</label>

  {/* Show existing photo */}
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
            <div className="mt-4 d-flex justify-content-end">
              <button type="button" className="btn btn-outline-secondary me-2" onClick={closeForm}>
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0">Members</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setShowAddForm(true);
            setShowEditForm(false);
            resetForm();
          }}
        >
          <PlusCircle size={18} className="me-1" />
          Add New Member
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            aria-label="Close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      <AnimatePresence>
        {showAddForm && renderMemberForm(false, handleAddMember)}
        {showEditForm && renderMemberForm(true, handleUpdateMember)}
      </AnimatePresence>

      <div className="card shadow">
        <div className="card-header bg-light">
          <div className="row align-items-center">
            <div className="col">
              <h5 className="mb-0">All Members</h5>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <Search size={18} />
                </span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search members..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => setSearchTerm('')}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-5">
              <p className="mb-0">No members found. Add your first member!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Profile Photo</th>
                    <th>Name</th>
                    
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id}>
                        <td>
                        <img
  src={
    member.photo
      ? `http://localhost/gym_back/uploads/profile_photo/${member.photo}`
      : member.gender === 'male'
      ? 'http://localhost/gym_back/uploads/profile_photo/male-profile.png'
      : 'http://localhost/gym_back/uploads/profile_photo/female-profile.png'
  }
  alt="Profile"
  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
/>

                        </td>
                      <td>{`${member.first_name} ${member.last_name}`}</td>
                      
                      <td>{member.phone}</td>
                     <td>{member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}</td>

                     <td>
  {new Date(member.join_date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}
</td>

                      <td>
                        <span className={`badge ${
                          member.status === '1' ? 'bg-success' : 'bg-danger'
                        }`}>
                          {member.status === '1' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            onClick={() => editMember(member)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {members.length > 0 && (
          <div className="card-footer bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <span>Showing {filteredMembers.length} of {members.length} members</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;