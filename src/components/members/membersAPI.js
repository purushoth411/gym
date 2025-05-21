// components/members/membersAPI.js
/**
 * API functions for members management
 */

/**
 * Fetch all members from the API
 * @returns {Promise<Array>} Array of member objects
 */
export const fetchMembers = async () => {
    const response = await fetch('http://localhost/gym-admin/api/members');
    
    if (!response.ok) {
      throw new Error('Failed to fetch members');
    }
    
    return await response.json();
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
    
    const response = await fetch('http://localhost/gym-admin/api/members/add', {
      method: 'POST',
      body: formData,
    });
    
    return await response.json();
  };
  
  /**
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
    
    const response = await fetch(`http://localhost/gym-admin/api/members/update/${memberData.id}`, {
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
    const response = await fetch(`http://localhost/gym-admin/api/members/delete/${id}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.status) {
      throw new Error(result.message || 'Failed to delete member');
    }
    
    return result;
  };