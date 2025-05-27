// components/members/SubscriptionForm.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Calendar } from 'lucide-react';

const SubscriptionForm = ({
  isEdit,
  currentSubscription,
  memberId,
  memberName,
  availablePlans,
  onSubmit,
  onClose,
}) => {
  const [subscription, setSubscription] = useState({
    id: null,
    member_id: memberId,
    membership_id: '',
  
    amount_paid: '',
    payment_method: 'cash',
  });

  const [selectedPlanDuration, setSelectedPlanDuration] = useState(0);

  // Initialize form when editing
  useEffect(() => {
  if (isEdit && currentSubscription) {
    setSubscription(currentSubscription);
  } else {
    setSubscription(prev => ({
      ...prev,
      member_id: memberId
    }));
  }
}, [isEdit, currentSubscription, memberId]);


  // Handle input changes
  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setSubscription(prev => ({ ...prev, [name]: value }));

  if (name === 'membership_id') {
    const selectedPlan = availablePlans.find(plan => plan.id === parseInt(value, 10));
    if (selectedPlan) {
      setSubscription(prev => ({ 
        ...prev, 
        amount_paid: selectedPlan.amount,
      }));
      setSelectedPlanDuration(selectedPlan.duration_days);
    }
  }
};


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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(subscription);
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
        zIndex: 1000,
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
          <h5 className="mb-0">
            {isEdit ? 'Edit Subscription' : 'Add New Subscription'} for {memberName}
          </h5>
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="membership_id" className="form-label">Membership Plan</label>
            <select
              className="form-select"
              id="membership_id"
              name="membership_id"
              value={subscription.membership_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a plan</option>
              {availablePlans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - {plan.duration_days} days (₹{plan.amount})
                </option>
              ))}
            </select>
          </div>
          
      
          
          <div className="row g-3 mt-2">
            <div className="col-md-6">
              <label htmlFor="amount_paid" className="form-label">Amount Paid</label>
              <div className="input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="amount_paid"
                  name="amount_paid"
                  value={subscription.amount_paid}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="payment_method" className="form-label">Payment Method</label>
              <select
                className="form-select"
                id="payment_method"
                name="payment_method"
                value={subscription.payment_method}
                onChange={handleInputChange}
                required
              >
                <option value="Cash">Cash</option>
                <option value="Credit/Debit Card">Credit/Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 d-flex justify-content-end">
            <button type="button" className="btn btn-outline-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} className="me-1" />
              {isEdit ? 'Update Subscription' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SubscriptionForm;