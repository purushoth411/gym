// components/members/SubscriptionList.jsx
import React from 'react';
import { Edit2, Trash2, PlusCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SubscriptionList = ({ 
  member, 
  subscriptions, 
  loading, 
  onClose, 
  onAddSubscription, 
  onEditSubscription, 
  onDeleteSubscription,
  onMarkAsActive
}) => {
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

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
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
          width: '700px',
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
            Subscriptions for {member.first_name} {member.last_name}
          </h5>
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        
        <div className="d-flex justify-content-end mb-4">
          <button 
            className="btn btn-prime" 
            onClick={() => onAddSubscription(member.id)}
          >
            <PlusCircle size={18} className="me-1" />
            Add Subscription
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-prime" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading subscriptions...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="alert alert-info">
            No subscription plans found for this member. Add a new subscription!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>Plan Name</th>
                  <th>Period</th>
                  <th>Amount Paid</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => {
                  const currentDate = new Date();
                  const endDate = new Date(sub.end_date);
                  const isActive = currentDate <= endDate;
                  const daysLeft = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={sub.id}>
                      <td>{sub.plan_name}</td>
                      <td>
                        {new Date(sub.start_date).toLocaleDateString('en-GB')} - {' '}
                        {new Date(sub.end_date).toLocaleDateString('en-GB')}
                      </td>
                      <td>{formatCurrency(sub.amount_paid)}</td>
                      <td>{sub.payment_method || 'N/A'}</td>
                    <td>
  {sub.subscription_status == 1 ? (
    <span className="badge bg-success">
      Active ({daysLeft} days left)
    </span>
  ) : sub.subscription_status == 2 ? (
    <span className="badge bg-danger">Expired</span>
  ) : sub.subscription_status == 3 ? (
    <>
      <span className="badge bg-warning text-dark me-2">Upcoming</span>
      <button 
        className="btn btn-sm btn-info"
        onClick={() => onMarkAsActive(sub.id)}
      >
        Mark as Active
      </button>
    </>
  ) :sub.subscription_status == 4 ?(
    <span className='badge bg-primary'>Suspended</span>
  ):(
    <span className="badge bg-secondary">Unknown</span>
  )}
</td>

                      <td>
                        <div className="btn-group">
                             {sub.subscription_status != 4 && (
                            <button 
                              className="btn btn-sm btn-outline-primary" 
                              onClick={() => onEditSubscription(sub)}
                              title="Edit Subscription"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDeleteSubscription(sub.id)}
                            title="Delete Subscription"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SubscriptionList;