import React from "react";
import "./userDetails.css";

const UserDetails = (props) => {
  return (
    <div className="userDetials">
      <div className="username">
        <div className="userIcon">
          <p>A</p>
        </div>
        <p className="fullname">Amit RG</p>
        <span className="status">• Offline</span>
        <div className="contact">
          <div className="call">
            <span class="material-symbols-outlined">call</span>
            <p>Call</p>
          </div>
          <div className="profile">
            <span class="material-symbols-outlined">account_circle</span>
            <p>Profile</p>
          </div>
        </div>
      </div>
      <div className="customerDetails">
        <h2>Customer Details</h2>
        <div className="email">
          <p>Email</p>
          <p>amit@gmail.com</p>
        </div>
        <div className="firstName">
          <p>First Name</p>
          <p>Amit</p>
        </div>
        <div className="lastName">
          <p>Last Name</p>
          <p>RG</p>
        </div>
        <button>View more Details</button>
      </div>
    </div>
  );
};

export default UserDetails;
