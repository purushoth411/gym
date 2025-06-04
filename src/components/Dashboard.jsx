import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck,AlertOctagon, UserX, Clock,Hourglass } from "lucide-react";
import LoaderGif from "../assets/loader.svg"; 

const Dashboard = () => {
  const [expiringToday, setExpiringToday] = useState([]);
  const [expiringWeek, setExpiringWeek] = useState([]);
  const [expired, setExpired] = useState([]);
  const[inactiveMember,setInactiveMember]=useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMembers, setActiveMembers] = useState(0);
  const[memberDistribution,setMemberDistribution]=useState([]);

  const fetchDatas = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost/gym_back/api/members/get_filtered_members"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expired members");
      }
      const data = await response.json();
      setExpired(data.expired);
      setExpiringToday(data.expiring_today);
      setExpiringWeek(data.expiring_week);
      setInactiveMember(data.inactive_members);
    } catch (error) {
      console.error("Error fetching expired members:", error);
    } finally {
      setLoading(false);
    }
  };
 const fetchActiveMembers = async () => {
      try {
      setLoading(true);
      const response = await fetch(
        "http://localhost/gym_back/api/members/getactivememberscount"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expired members");
      }
      const data = await response.json();
      setActiveMembers(data.active_members_count);
      
    } catch (error) {
      console.error("Error fetching expired members:", error);
    } finally {
      setLoading(false);
    }
  }
  const fetchMemberDistribution=async ()=>{
    try{
      setLoading(true);
      const response = await fetch('http://localhost/gym_back/api/members/membershipdistribution');
      if(!response.ok){
        throw new Error("Failed to fetch member distribution");

      }
      const data=await response.json();
      setMemberDistribution(data.distribution);
      console.log(memberDistribution);
      
    }catch(error){
      console.error("Error fetching member distribution:",error);
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDatas();
    fetchActiveMembers();
    fetchMemberDistribution();
  }, []);

  const renderMemberList = (members, labelKey = "expiry_date") => {
  return (
    <ul className="list-group list-group-flush">
      {members.length === 0 ? (
        <li className="list-group-item text-muted">No records</li>
      ) : (
        members.map((member, index) => (
          <li key={index} className="list-group-item py-2 px-3" style={{ fontSize: "14px" }}>
            <strong>{member.first_name} {member.last_name}</strong><br />
            <span className="text-muted">Plan: {member.membership_name}</span><br />
            <span className="text-muted">
              {labelKey === "expired" && <>Expired on: {member.end_date}</>}
              {labelKey === "today" && <>Expires today: {member.end_date}</>}
              {labelKey === "week" && <>Expires: {member.end_date}</>}
            </span>
          </li>
        ))
      )}
    </ul>
  );
};
const inactiveMembersList = (members) => {
  return (
    <ul className="list-group list-group-flush">
      {members.length === 0 ? (
        <li className="list-group-item text-muted">No records</li>
      ) : (
        members.map((member, index) => (
          <li key={index} className="list-group-item py-2 px-3" style={{ fontSize: "14px" }}>
            <strong>{member.first_name} {member.last_name}</strong><br />
            <span className="text-muted">{member.email}</span>
          </li>
        ))
      )}
    </ul>
  );
};

 
  return (
    <main className="flex-grow-1 py-4">
      <div className="container">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h1 className="h3 mb-4">Welcome to Gym Admin Dashboard</h1>
            <p className="text-muted">
              Access all your gym management tools from one place.
            </p>
          </div>
        </div>
           <div className="row g-4 mb-4">
          {/* Total Members */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                    <Users size={24} className="text-primary" />
                  </div>
                  <h3 className="h5 mb-0">Members</h3>
                </div>
                <h4 className="mb-0 fw-bold">{activeMembers}</h4>
                <p className="text-muted small mb-4">Total active members</p>
                <Link
                  to="/members"
                  className="btn btn-sm btn-outline-primary w-100"
                >
                  Manage Members
                </Link>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded-3 me-3">
                    <UserCheck size={24} className="text-info" />
                  </div>
                  <h3 className="h5 mb-0">Plans and Prices</h3>
                </div>
                <h4 className="mb-0 fw-bold">{memberDistribution.length}</h4>
                <p className="text-muted small mb-4">Active Plans</p>
                <Link
                  to="/plans"
                  className="btn btn-sm btn-outline-info w-100"
                >
                  Manage Plans
                </Link>
              </div>
            </div>
          </div>

          {/* Membership Stats */}
        <div className="col-lg-6 ">
  <div className="card shadow-sm">
    <div className="card-header bg-light">
      <h5 className="mb-0">Membership Stats</h5>
    </div>
   <div className="card-body">
  {memberDistribution && memberDistribution.length > 0 ? (
    [...Array(Math.ceil(memberDistribution.length / 2))].map((_, rowIndex) => (
      <div className="row" key={rowIndex}>
        {[0, 1].map((colIndex) => {
          const stat = memberDistribution[rowIndex * 2 + colIndex];
          if (!stat) return null;

          const colors = ["bg-secondary", "bg-success", "bg-info", "bg-warning", "bg-danger"];
          const color = colors[(rowIndex * 2 + colIndex) % colors.length];

          return (
            <div className="col-md-6 mb-4" key={colIndex}>
              <div className="d-flex justify-content-between mb-1">
                <span>{stat.membership_name}</span>
                <span>{stat.percentage}%</span>
              </div>
              <div className="progress" style={{ height: "10px" }}>
                <div
                  className={`progress-bar ${color}`}
                  style={{ width: `${stat.percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    ))
  ) : (
    <p className="text-muted">No membership data available.</p>
  )}
</div>

  </div>
</div>

        </div>

        {/* Loader */}
        {loading && (
          <div className="text-center my-5">
            <img
      src={LoaderGif} 
      alt="Loading..."
      style={{ width: '80px', height: '80px' }}
    />
          </div>
        )}

       {!loading && (
  <div className="row g-4">
  {/* Expired Members */}
  <div className="col-lg-3">
    <div className="card shadow-sm h-100 border-start border-4 border-danger">
      <div className="card-header" style={{ backgroundColor: "#f8d7da" }}>
        <h5 className="mb-0 text-danger d-flex align-items-center gap-2">
          <AlertOctagon size={18} /> Expired Members
        </h5>
      </div>
      <div className="card-body p-2 column">
        {renderMemberList(expired, "expired")}
      </div>
    </div>
  </div>

  {/* Inactive Members */}
  <div className="col-lg-3">
    <div className="card shadow-sm h-100 border-start border-4 border-secondary">
      <div className="card-header" style={{ backgroundColor: "#e2e3e5" }}>
        <h5 className="mb-0 text-secondary d-flex align-items-center gap-2">
          <UserX size={18} /> Inactive Members
        </h5>
      </div>
      <div className="card-body p-2 column">
        {inactiveMembersList(inactiveMember)}
      </div>
    </div>
  </div>

  {/* Expiring Today */}
  <div className="col-lg-3">
    <div className="card shadow-sm h-100 border-start border-4 border-warning">
      <div className="card-header" style={{ backgroundColor: "#fff3cd" }}>
        <h5 className="mb-0 text-warning d-flex align-items-center gap-2">
          <Clock size={18} /> Expiring Today
        </h5>
      </div>
      <div className="card-body p-2 column">
        {renderMemberList(expiringToday, "today")}
      </div>
    </div>
  </div>

  {/* Expiring Within a Week */}
  <div className="col-lg-3">
    <div className="card shadow-sm h-100 border-start border-4 border-info">
      <div className="card-header" style={{ backgroundColor: "#d1ecf1" }}>
        <h5 className="mb-0 text-info d-flex align-items-center justify-content-between">
          <span className="d-flex align-items-center gap-2">
            <Hourglass size={18} /> Expiring Within a Week
          </span>
        </h5>
      </div>
      <div className="card-body p-2 column">
        {renderMemberList(expiringWeek, "week")}
      </div>
    </div>
  </div>
</div>

)}

      </div>
    </main>
  );
};

export default Dashboard;
