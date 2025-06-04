// components/members/index.jsx

import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import MembersList from './MembersList';
import MemberForm from './MemberForm';
import SearchBar from './SearchBar';
import SubscriptionList from './SubscriptionList';
import SubscriptionForm from './SubscriptionForm';
import { fetchMembers, addMember, updateMember, deleteMember } from './membersAPI';
import LoaderGif from '../../assets/loader.svg';
import { toast } from 'react-hot-toast';

import { 
  fetchMemberSubscriptions, 
  fetchMembershipPlans, 
  addSubscription, 
  updateSubscription, 
  deleteSubscription,
  markSubscriptionAsActive
} from './subscriptionsAPI';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genderFilter, setGenderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Hardcoded filter options
  const genders = ['male', 'female', 'other'];
  const statuses = [
    { id: 'inactive', name: 'Inactive' },
    { id: 'expired', name: 'Expired' },
    { id: 'active', name: 'Active' }
  ];

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMember, setCurrentMember] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    phone: '',
    alt_phone: '',
    email: '',
    address: '',
    medical_info: '',
    join_date: '',
    status: '1'
  });

  // Subscription state
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [showEditSubscription, setShowEditSubscription] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  // Fetch members function
  const loadMembers = async (gender = '', status = '') => {
    try {
      setLoading(true);
      const data = await fetchMembers(gender, status);
      setMembers(data.members || data); // Handle both possible response formats
      setError(null);
    } catch (err) {
      setError('Error loading members: ' + err.message);
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch members when component mounts
  useEffect(() => {
    loadMembers();
  }, []);

  // Fetch members when filters change
  useEffect(() => {
    loadMembers(genderFilter, statusFilter);
  }, [genderFilter, statusFilter]);

  // Fetch membership plans when component mounts
  useEffect(() => {
    const loadMembershipPlans = async () => {
      try {
        const data = await fetchMembershipPlans();
        setMembershipPlans(data);
      } catch (err) {
        setError('Error loading membership plans: ' + err.message);
        console.error('Error fetching membership plans:', err);
      }
    };

    loadMembershipPlans();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, type, files, value } = e.target;
  
    setCurrentMember(prevState => ({
      ...prevState,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  // Reset form fields
  const resetForm = () => {
    setCurrentMember({
      first_name: '',
      last_name: '',
      gender: '',
      date_of_birth: '',
      phone: '',
      alt_phone: '',
      email: '',
      address: '',
      medical_info: '',
      join_date: '',
      status: '1'
    });
  };

  // Handle add member submission
  const handleAddMember = async (e) => {
  e.preventDefault();

  try {
    const result = await addMember(currentMember);

    if (result.status && result.member) {
      setMembers(prevMembers => [...prevMembers, result.member]);
      resetForm();
      setShowAddForm(false);

      // ✅ Show success toast
      toast.success("Member added successfully!");
    } else if (result.errors) {
      setError('Validation error: ' + result.errors);

      // ⚠️ Optional error toast
      toast.error("Validation error occurred.");
    } else {
      setError('Something went wrong while adding member.');
      toast.error("Failed to add member.");
    }
  } catch (err) {
    setError('Error adding member: ' + err.message);
    toast.error("Error: " + err.message);
    console.error('Error adding member:', err);
  }
};


  // Handle edit member submission
  const handleUpdateMember = async (e) => {
    e.preventDefault();
  
    try {
      const result = await updateMember(currentMember);
      
      if (result.status && result.member) {
        setMembers(prevMembers =>
          prevMembers.map(member => member.id === result.member.id ? result.member : member)
        );
        resetForm();
        setShowEditForm(false);
        toast.success("Member updated successfully!");
      } else {
       // throw new Error(result.message || 'Failed to update member');
        toast.error("failed to Update member");
      }
    } catch (err) {
      setError('Error updating member: ' + err.message);
      console.error('Error updating member:', err);
      toast.error("Error: " +err.message);
    }
  };

  // Edit member
  const editMember = (member) => {
    setCurrentMember({...member});
    setShowEditForm(true);
    setShowAddForm(false);
  };

  // Handle delete member
  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        const result = await deleteMember(id);
        
        if (result.status) {
          setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
          toast.success("Member Deleted Successfully!");
        } else {
          toast.error("Failed to delete member");
         /// throw new Error(result.message || 'Failed to delete member');
        }
      } catch (err) {
        setError('Error deleting member: ' + err.message);
        toast.error('Error deleting member: ' + err.message);
        console.error('Error deleting member:', err);
      }
    }
  };

  // View member subscriptions
  const viewSubscriptions = async (member) => {
    setSelectedMember(member);
    setLoadingSubscriptions(true);
    setShowSubscriptions(true);
    
    try {
      const data = await fetchMemberSubscriptions(member.id);
      setSubscriptions(data);
    } catch (err) {
      setError('Error loading subscriptions: ' + err.message);
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  // Handle add subscription
  const handleAddSubscription = (memberId) => {
    setShowAddSubscription(true);
    setShowEditSubscription(false);
    setCurrentSubscription(null);
  };

  // Handle edit subscription
  const handleEditSubscription = (subscription) => {
    setCurrentSubscription(subscription);
    setShowEditSubscription(true);
    setShowAddSubscription(false);
  };

  // Handle delete subscription
  const handleDeleteSubscription = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        const result = await deleteSubscription(id);
        
        if (result.status) {
          setSubscriptions(prevSubscriptions => 
            prevSubscriptions.filter(sub => sub.id !== id)
          );
          toast.success("Subscription deleted successfully!");
        } else {
          toast.error("Failed to delete subscription");
          throw new Error(result.message || 'Failed to delete subscription');
        }
      } catch (err) {
        toast.error("Error deleting subscription: " + err.message);
        setError('Error deleting subscription: ' + err.message);
        console.error('Error deleting subscription:', err);
      }
    }
  };

  // Submit add subscription
  const submitAddSubscription = async (subscriptionData) => {
    try {
      const result = await addSubscription(subscriptionData);
      
      if (result.status && result.subscription) {
        // Reload full subscription list from API
        await viewSubscriptions(selectedMember);
        setShowAddSubscription(false);
        toast.success("ubscription added successfully!");
      } else {
        toast.error("Failed to add subscription");
        throw new Error(result.message || 'Failed to add subscription');
      }
    } catch (err) {
      toast.error("Error adding subscription: " + err.message);
      setError('Error adding subscription: ' + err.message);
      console.error('Error adding subscription:', err);
    }
  };

  // Submit update subscription
  const submitUpdateSubscription = async (subscriptionData) => {
    try {
      const result = await updateSubscription(subscriptionData);
      
      if (result.status && result.subscription) {
        await viewSubscriptions(selectedMember);
        setShowEditSubscription(false);
        setCurrentSubscription(null);
        toast.success("Subscription upadted successfully1");
      } else {
        toast.error("Failed to update subscription");
        throw new Error(result.message || 'Failed to update subscription');
      }
    } catch (err) {
      toast.error("Error updating subscription: " + err.message);
      setError('Error updating subscription: ' + err.message);
      console.error('Error updating subscription:', err);
    }
  };

  const handleMarkAsActive = async (subscriptionId) => {
    try {
      await markSubscriptionAsActive(subscriptionId);
      if (selectedMember?.id) {
        const updated = await fetchMemberSubscriptions(selectedMember.id);
        setSubscriptions(updated);
        toast.success("Subscription activated successfully!");
      } else {
        toast.error("Selected member is undefined.");
        console.warn("Selected member is undefined.");
      }
    } catch (error) {
      toast.error("Failed to activate subscription:" + error.message);
      console.error('Failed to activate subscription:', error.message);
    }
  };

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm)
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0">Members</h2>
        <button 
          className="btn btn-prime" 
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

      {/* Member Forms */}
      {showAddForm && (
        <MemberForm 
          isEdit={false}
          currentMember={currentMember}
          handleInputChange={handleInputChange}
          onSubmit={handleAddMember}
          onClose={() => setShowAddForm(false)}
        />
      )}
      
      {showEditForm && (
        <MemberForm 
          isEdit={true}
          currentMember={currentMember}
          handleInputChange={handleInputChange}
          onSubmit={handleUpdateMember}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {/* Subscription List */}
      {showSubscriptions && selectedMember && (
        <SubscriptionList 
          member={selectedMember}
          subscriptions={subscriptions}
          loading={loadingSubscriptions}
          onClose={() => setShowSubscriptions(false)}
          onAddSubscription={handleAddSubscription}
          onEditSubscription={handleEditSubscription}
          onDeleteSubscription={handleDeleteSubscription}
          onMarkAsActive={handleMarkAsActive}
        />
      )}

      {/* Add Subscription Form */}
      {showAddSubscription && selectedMember && (
        <SubscriptionForm 
          isEdit={false}
          currentSubscription={null}
          memberId={selectedMember.id}
          memberName={`${selectedMember.first_name} ${selectedMember.last_name}`}
          availablePlans={membershipPlans}
          onSubmit={submitAddSubscription}
          onClose={() => setShowAddSubscription(false)}
        />
      )}

      {/* Edit Subscription Form */}
      {showEditSubscription && selectedMember && currentSubscription && (
        <SubscriptionForm 
          isEdit={true}
          currentSubscription={currentSubscription}
          memberId={selectedMember.id}
          memberName={`${selectedMember.first_name} ${selectedMember.last_name}`}
          availablePlans={membershipPlans}
          onSubmit={submitUpdateSubscription}
          onClose={() => setShowEditSubscription(false)}
        />
      )}

      <div className="card shadow">
        <div className="card-header bg-light">
          <div className="row align-items-center">
            <div className="col">
              <h5 className="mb-0">All Members</h5>
            </div>
            <div className="col-md-4">
              <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="">All Genders</option>
                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <MembersList 
          loading={loading}
          members={filteredMembers}
          totalMembers={members.length}
          editMember={editMember}
          deleteMember={handleDeleteMember}
          viewSubscriptions={viewSubscriptions}
        />
      </div>
    </div>
  );
};

export default Members;