// components/members/subscriptionsAPI.js
/**
 * API functions for member subscriptions
 */

/**
 * Fetch all subscriptions for a specific member
 * @param {number|string} memberId - ID of the member
 * @returns {Promise<Array>} Array of subscription objects
 */
export const fetchMemberSubscriptions = async (memberId) => {
    const response = await fetch(`http://localhost/gym_back/api/subscriptions/member/${memberId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch member subscriptions');
    }
    
    return await response.json();
  };
  
  /**
   * Fetch all available membership plans
   * @returns {Promise<Array>} Array of membership plan objects
   */
  export const fetchMembershipPlans = async () => {
    const response = await fetch('http://localhost/gym_back/api/memberships');
    
    if (!response.ok) {
      throw new Error('Failed to fetch membership plans');
    }
    
    return await response.json();
  };
  
  /**
   * Add a new subscription for a member
   * @param {Object} subscriptionData - Subscription data to add
   * @returns {Promise<Object>} API response
   */
  export const addSubscription = async (subscriptionData) => {
    const response = await fetch('http://localhost/gym_back/api/subscriptions/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.status) {
      
      throw new Error(result.message || 'Failed to add subscription');
    }
    
    return result;
  };
  
  /**
   * Update an existing subscription
   * @param {Object} subscriptionData - Subscription data to update
   * @returns {Promise<Object>} API response
   */
  export const updateSubscription = async (subscriptionData) => {
    const response = await fetch(`http://localhost/gym_back/api/subscriptions/update/${subscriptionData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.status) {
      throw new Error(result.message || 'Failed to update subscription');
    }
    
    return result;
  };
  
  /**
   * Delete a subscription
   * @param {number|string} id - Subscription ID to delete
   * @returns {Promise<Object>} API response
   */
  export const deleteSubscription = async (id) => {
    const response = await fetch(`http://localhost/gym_back/api/subscriptions/delete/${id}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.status) {
      throw new Error(result.message || 'Failed to delete subscription');
    }
    
    return result;
  };

  export const markSubscriptionAsActive = async (subscriptionId) => {
  const response = await fetch(`http://localhost/gym_back/api/subscriptions/activate/${subscriptionId}`, {
    method: 'POST',
  });

  const result = await response.json();

  if (!response.ok || !result.status) {
    throw new Error(result.message || 'Failed to activate subscription');
  }

  return result;
};
