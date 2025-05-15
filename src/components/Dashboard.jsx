import React from "react";
import { Link } from "react-router-dom";
import { Users, Calendar, UserCheck, BarChart2 } from 'lucide-react';

const Dashboard = () => (
  <main className="flex-grow-1 py-4">
    <div className="container">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h1 className="h3 mb-4">Welcome to Gym Admin Dashboard</h1>
          <p className="text-muted">Access all your gym management tools from one place.</p>
        </div>
      </div>
     
      {/* Dashboard cards */}
      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                  <Users size={24} className="text-primary" />
                </div>
                <h3 className="h5 mb-0">Members</h3>
              </div>
              <h4 className="mb-0 fw-bold">247</h4>
              <p className="text-muted small mb-4">Total active members</p>
              <Link to="/members" className="btn btn-sm btn-outline-primary w-100">
                Manage Members
              </Link>
            </div>
          </div>
        </div>
        {/* <div className="col-md-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3">
                  <Calendar size={24} className="text-success" />
                </div>
                <h3 className="h5 mb-0">Classes</h3>
              </div>
              <h4 className="mb-0 fw-bold">18</h4>
              <p className="text-muted small mb-4">Active classes this week</p>
              <Link to="/classes" className="btn btn-sm btn-outline-success w-100">
                Manage Classes
              </Link>
            </div>
          </div>
        </div> */}
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-info bg-opacity-10 p-3 rounded-3 me-3">
                  <UserCheck size={24} className="text-info" />
                </div>
                <h3 className="h5 mb-0">Plans and Prices</h3>
              </div>
              <h4 className="mb-0 fw-bold">12</h4>
              <p className="text-muted small mb-4">Active Plans</p>
              <Link to="/trainers" className="btn btn-sm btn-outline-info w-100">
                Manage Plans
              </Link>
            </div>
          </div>
        </div>
       
      </div>

      {/* Recent activities and stats */}
      <div className="row g-4 mt-2">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Recent Activities</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">New member registered</h6>
                    <small className="text-muted">3 minutes ago</small>
                  </div>
                  <p className="mb-1">John Doe registered as a new member with Premium plan.</p>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Payment received</h6>
                    <small className="text-muted">1 hour ago</small>
                  </div>
                  <p className="mb-1">$129 payment received from Sarah Smith for monthly membership.</p>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Class schedule updated</h6>
                    <small className="text-muted">2 hours ago</small>
                  </div>
                  <p className="mb-1">Yoga class rescheduled from 5:00 PM to 6:30 PM today.</p>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">New trainer added</h6>
                    <small className="text-muted">Yesterday</small>
                  </div>
                  <p className="mb-1">Michael Johnson joined as a new fitness trainer.</p>
                </div>
              </div>
            </div>
            <div className="card-footer bg-white">
              <Link to="/activities" className="btn btn-sm btn-link text-primary p-0">View all activities</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Membership Stats</h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Basic</span>
                  <span>35%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div className="progress-bar bg-secondary" style={{ width: "35%" }}></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Premium</span>
                  <span>45%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div className="progress-bar bg-success" style={{ width: "45%" }}></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Platinum</span>
                  <span>20%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div className="progress-bar bg-info" style={{ width: "20%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);

export default Dashboard;