import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, DollarSign, Calendar, Users } from 'lucide-react';
import LoaderGif from '../assets/loader.svg';
const PlansAndPrices = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch plans from ci3
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/gym_back/api/memberships/getmembershipswithmembercount', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch membership plans');
      }

      const data = await response.json();
      setPlans(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (plan) => {
    setEditingPlan(plan.id);
    setEditAmount(plan.amount.toString());
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setEditAmount('');
  };

  const handleSaveAmount = async (planId) => {
  try {
    setSaving(true);
    const response = await fetch(`http://localhost/gym_back/api/memberships/update/${planId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseFloat(editAmount)
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      throw new Error(result.message || 'Failed to update plan amount');
    }

    // Update the local state with the updated amount
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, amount: parseFloat(editAmount) }
        : plan
    ));

    setEditingPlan(null);
    setEditAmount('');
    setError(null);
  } catch (err) {
    setError(err.message);
    console.error('Error updating amount:', err);
  } finally {
    setSaving(false);
  }
};
;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
           <img
                src={LoaderGif} 
                alt="Loading..."
                style={{ width: '100px', height: '100px' }}
              />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
             
              Plans and Prices
            </h2>
            {/* <button 
              className="btn btn-outline-primary"
              onClick={fetchPlans}
            >
              Refresh
            </button> */}
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="row">
            {plans.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  <h5>No membership plans found</h5>
                  <p className="mb-0">No membership plans are currently available.</p>
                </div>
              </div>
            ) : (
              plans.map((plan) => (
                <div key={plan.id} className="col-md-6 col-lg-3 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title text-prime">
                          {plan.name || `Plan ${plan.id}`}
                        </h5>
                        {editingPlan !== plan.id && (
                          <button
                            className="btn btn-sm "
                            onClick={() => handleEditClick(plan)}
                            title="Edit Amount"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="mb-3">
                        {editingPlan === plan.id ? (
                          <div className="input-group">
                            <span className="input-group-text">₹</span>
                            <input
                              type="number"
                              className="form-control"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              placeholder="Enter amount"
                              min="0"
                              step="0.01"
                            />
                            <button
                              className="btn btn-prime"
                              onClick={() => handleSaveAmount(plan.id)}
                              disabled={saving || !editAmount}
                            >
                              {saving ? (
                                <div className="spinner-border spinner-border-sm" role="status">
                                  <span className="visually-hidden">Saving...</span>
                                </div>
                              ) : (
                                <Save size={16} />
                              )}
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={handleCancelEdit}
                              disabled={saving}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <h3 className="text-prime2 mb-0">
                            {formatCurrency(plan.amount)}
                          </h3>
                        )}
                      </div>

                      <div className="mb-3">
                        {plan.duration && (
                          <div className="d-flex align-items-center text-muted mb-2">
                            <Calendar size={16} className="me-2" />
                            <small>{plan.duration}</small>
                          </div>
                        )}
                        {plan.description && (
                          <p className="card-text text-muted small">
                            {plan.description}
                          </p>
                        )}
                      </div>
                       {plan.active_member_count !== undefined && (
      <div className="d-flex align-items-center text-muted mb-2">
        <Users size={16} className="me-2" />
        <small>{plan.active_member_count} active member{plan.active_member_count === 1 ? '' : 's'}</small>
      </div>
    )}

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                         
                          {plan.active !== undefined && (
                            <span className={`badge ${plan.active ? 'bg-success' : 'bg-secondary'}`}>
                              {plan.active ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default PlansAndPrices;