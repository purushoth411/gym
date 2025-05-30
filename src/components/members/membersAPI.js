// components/members/membersAPI.js
/**
 * API functions for members management
 */

/**
 * Fetch all members from the API
 * @returns {Promise<Array>} Array of member objects
 */
export const fetchMembers = async (gender = '', status = '') => {
  try {
    const params = new URLSearchParams();
    if (gender) params.append('gender', gender);
    if (status) params.append('status', status);
    
    const queryString = params.toString();
    const url = `http://localhost/gym_back/api/members${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};
  
  /**
   * Add a new member
   * @param {Object} memberData - Member data to add
   * @returns {Promise<Object>} API response
   */
  export const addMember = async (memberData) => {
    const formData = new FormData();
    
    // Append all member data to the form
    for (let key in memberData) {
      if (memberData[key] !== undefined && memberData[key] !== null) {
        formData.append(key, memberData[key]);
      }
    }
    
    const response = await fetch('http://localhost/gym_back/api/members/add', {
      method: 'POST',
      body: formData,
    });
    
    return await response.json();
  };
  


  /**
   * 
   * Update an existing member
   * @param {Object} memberData - Member data to update
   * @returns {Promise<Object>} API response
   */
  export const updateMember = async (memberData) => {
    const formData = new FormData();
    
    // Append all member data to the form
    for (let key in memberData) {
      if (memberData[key] !== undefined && memberData[key] !== null) {
        formData.append(key, memberData[key]);
      }
    }
    
    const response = await fetch(`http://localhost/gym_back/api/members/update/${memberData.id}`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.status) {
      throw new Error(result.message || 'Failed to update member');
    }
    
    return result;
  };
  
  /**
   * Delete a member
   * @param {number|string} id - Member ID to delete
   * @returns {Promise<Object>} API response
   */
  export const deleteMember = async (id) => {
    const response = await fetch(`http://localhost/gym_back/api/members/delete/${id}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.status) {
      throw new Error(result.message || 'Failed to delete member');
    }
    
    return result;
  };