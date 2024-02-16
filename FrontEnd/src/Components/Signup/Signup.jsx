import React, { useState } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config.js";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const navigate = useNavigate();
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}user/signup`, formData);
      const data = response.data;
      if (data.message === "User signed in successfully.") {
        localStorage.setItem("token", data.token);
        navigate("/login");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <label className="remember-me">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          Remember Me
        </label>

        <button type="submit">Sign Up</button>
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
