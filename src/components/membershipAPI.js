// services/membershipAPI.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost/your-ci3-app/index.php/membership_api';

class MembershipAPI {
  
  /**
   * Helper method to make API requests
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}/${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, finalOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Get membership statistics for dashboard
   */
  async getMembershipStats() {
    try {
      const response = await this.makeRequest('get_membership_stats');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch membership stats: ${error.message}`);
    }
  }

  /**
   * Get all members with optional filtering and pagination
   */
  async getMembers(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.filter) queryParams.append('filter', params.filter);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);

    const endpoint = `get_members${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    try {
      const response = await this.makeRequest(endpoint);
      return {
        members: response.data,
        pagination: response.pagination
      };
    } catch (error) {
      throw new Error(`Failed to fetch members: ${error.message}`);
    }
  }

  /**
   * Get membership plans
   */
  async getMembershipPlans() {
    try {
      const response = await this.makeRequest('get_membership_plans');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch membership plans: ${error.message}`);
    }
  }

  /**
   * Create new member
   */
  async createMember(memberData) {
    try {
      const response = await this.makeRequest('create_member', {
        method: 'POST',
        body: JSON.stringify(memberData)
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to create member: ${error.message}`);
    }
  }

  /**
   * Update member
   */
  async updateMember(memberId, memberData) {
    try {
      const response = await this.makeRequest(`update_member/${memberId}`, {
        method: 'PUT',
        body: JSON.stringify(memberData)
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to update member: ${error.message}`);
    }
  }

  /**
   * Delete member
   */
  async deleteMember(memberId) {
    try {
      const response = await this.makeRequest(`delete_member/${memberId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to delete member: ${error.message}`);
    }
  }

  /**
   * Renew member subscription
   */
  async renewSubscription(renewalData) {
    try {
      const response = await this.makeRequest('renew_subscription', {
        method: 'POST',
        body: JSON.stringify(renewalData)
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to renew subscription: ${error.message}`);
    }
  }

  /**
   * Get member details by ID
   */
  async getMemberById(memberId) {
    try {
      const response = await this.getMembers({ search: memberId });
      const member = response.members.find(m => m.id == memberId);
      
      if (!member) {
        throw new Error('Member not found');
      }
      
      return member;
    } catch (error) {
      throw new Error(`Failed to fetch member details: ${error.message}`);
    }
  }

  /**
   * Get expired members
   */
  async getExpiredMembers(page = 1, limit = 20) {
    return this.getMembers({ filter: 'expired', page, limit });
  }

  /**
   * Get members expiring today
   */
  async getMembersExpiringToday(page = 1, limit = 20) {
    return this.getMembers({ filter: 'expiring-today', page, limit });
  }

  /**
   * Get members expiring this week
   */
  async getMembersExpiringThisWeek(page = 1, limit = 20) {
    return this.getMembers({ filter: 'expiring-week', page, limit });
  }

  /**
   * Search members
   */
  async searchMembers(searchTerm, page = 1, limit = 20) {
    return this.getMembers({ search: searchTerm, page, limit });
  }
}

// Create and export a singleton instance
export const membershipAPI = new MembershipAPI();

// Also export the class for testing or custom instances
export default MembershipAPI;