import React from "react";
import "./userDetails.css";

const UserDetails = ({ name }) => {
  return (
    <div className="userDetials">
      <div className="username">
        <div className="userIcon">
          <p>{name[0]}</p>
        </div>
        <p className="fullname">{name}</p>
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
          <p>{name.split(" ")[0].toLowerCase()}@gmail.com</p>
        </div>
        <div className="firstName">
          <p>First Name</p>
          <p>{name.split(" ")[0]}</p>
        </div>
        <div className="lastName">
          <p>Last Name</p>
          <p>{name.split(" ")[1] ? name.split(" ")[1] : "-"}</p>
        </div>
        <button>View more Details</button>
      </div>
    </div>
  );
};

export default UserDetails;
