// components/members/MembersList.jsx
import React from "react";
import { Edit2, Trash2, CreditCard } from "lucide-react";

const MembersList = ({
  loading,
  members,
  totalMembers,
  editMember,
  deleteMember,
  viewSubscriptions,
}) => {
  if (loading) {
    return (
      <div className="card-body p-0">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading members...</p>
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="card-body p-0">
        <div className="text-center py-5">
          <p className="mb-0">No members found. Add your first member!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Profile Photo</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <img
                      src={
                        member.photo
                          ? `http://localhost/gym_back/uploads/profile_photo/${member.photo}`
                          : member.gender === "male"
                          ? "http://localhost/gym_back/uploads/profile_photo/male-profile.png"
                          : "http://localhost/gym_back/uploads/profile_photo/female-profile.png"
                      }
                      alt="Profile"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td>{`${member.first_name} ${member.last_name}`}</td>
                  <td>{member.phone}</td>
                  <td>
                    {member.gender.charAt(0).toUpperCase() +
                      member.gender.slice(1)}
                  </td>
                  <td>
                    {new Date(member.join_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        member.subscription_status === "1"
                          ? "bg-success"
                          : member.subscription_status === "2"
                          ? "bg-warning"
                          : member.subscription_status === "3"
                          ? "bg-primary"
                          : member.subscription_status === "4"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {member.subscription_status === "1"
                        ? "Active"
                        : member.subscription_status === "2"
                        ? "Expired"
                        : member.subscription_status === "3"
                        ? "Upcoming"
                        : member.subscription_status === "4"
                        ? "Suspended"
                        : "Unknown"}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => editMember(member)}
                        title="Edit Member"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteMember(member.id)}
                        title="Delete Member"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => viewSubscriptions(member)}
                        title="Subscriptions"
                      >
                        <CreditCard size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalMembers > 0 && (
        <div className="card-footer bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <span>
              Showing {members.length} of {totalMembers} members
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default MembersList;
