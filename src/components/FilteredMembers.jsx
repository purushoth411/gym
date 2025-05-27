import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FilteredMembers = () => {
  const [expired, setExpired] = useState([]);
  const [expiringToday, setExpiringToday] = useState([]);
  const [expiringWeek, setExpiringWeek] = useState([]);

  useEffect(() => {
    axios.get('http://your-backend-url/index.php/member_api/get_filtered_members')
      .then(res => {
        setExpired(res.data.expired);
        setExpiringToday(res.data.expiring_today);
        setExpiringWeek(res.data.expiring_week);
      })
      .catch(err => {
        console.error('Failed to fetch members:', err);
      });
  }, []);

  const renderList = (members) => (
    members.length === 0 ? <p className="text-muted">No members found.</p> :
    <ul className="list-group">
      {members.map(member => (
        <li className="list-group-item d-flex justify-content-between align-items-center" key={member.id}>
          {member.name}
          <span className="badge bg-secondary">{member.expiry_date}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="row mt-4">
      <div className="col-md-4">
        <h5>Expired Members</h5>
        {renderList(expired)}
      </div>

      <div className="col-md-4">
        <h5>Expiring Today</h5>
        {renderList(expiringToday)}
      </div>

      <div className="col-md-4">
        <h5>Expiring Within a Week</h5>
        {renderList(expiringWeek)}
      </div>
    </div>
  );
};

export default FilteredMembers;
