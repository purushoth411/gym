// components/members/MembersList.jsx
import React from "react";
import DataTable from "react-data-table-component";
import { Edit2, Trash2, CreditCard } from "lucide-react";
import LoaderGif from '../../assets/loader.svg';
const MembersList = ({
  loading,
  members,
  totalMembers,
  editMember,
  deleteMember,
  viewSubscriptions,
}) => {
  const columns = [
    {
      name: "Profile Photo",
      selector: row => (
        <img
          src={
            row.photo
              ? `http://localhost/gym_back/uploads/profile_photo/${row.photo}`
              : row.gender === "male"
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
      ),
      sortable: false,
    },
    {
      name: "Name",
      selector: row => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Phone",
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: "Gender",
      selector: row =>
        row.gender.charAt(0).toUpperCase() + row.gender.slice(1),
      sortable: true,
    },
    {
      name: "Join Date",
      selector: row =>
        new Date(row.join_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      sortable: true,
    },
    {
      name: "Status",
      selector: row => {
        const statusMap = {
          "1": { label: "Active", class: "bg-success" },
          "2": { label: "Expired", class: "bg-warning" },
          "3": { label: "Upcoming", class: "bg-primary" },
          "4": { label: "Suspended", class: "bg-danger" },
        };
        const status = statusMap[row.subscription_status] || {
          label: "Inactive",
          class: "bg-secondary",
        };
        return <span className={`badge ${status.class}`}>{status.label}</span>;
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: row => (
        <div className="btn-group">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => editMember(row)}
            title="Edit Member"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => deleteMember(row.id)}
            title="Delete Member"
          >
            <Trash2 size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => viewSubscriptions(row)}
            title="Subscriptions"
          >
            <CreditCard size={16} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="card-body">
      <DataTable
        columns={columns}
        data={members}
        progressPending={loading}
         progressComponent={
    <div className="text-center my-4 w-100">
      <img
        src={LoaderGif}
        alt="Loading..."
        style={{ width: "60px", height: "60px" }}
      />
      <p className="mt-2">Loading members...</p>
    </div>
  }
        pagination
        highlightOnHover
        striped
        responsive
        noHeader
      />
      {totalMembers > 0 && (
        <div className="card-footer bg-white">
          <span>
            Showing {members.length} of {totalMembers} members
          </span>
        </div>
      )}
    </div>
  );
};

export default MembersList;
