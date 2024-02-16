import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";
import { BASE_URL } from "../../config.js";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}user/login`, formData);
      const data = response.data;
      if (data.message === "User logged in successfully!") {
        localStorage.setItem("token", data.token);
        navigate("/register");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Login into your account</h2>

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

        <button type="submit">Login</button>
        <p className="login-link">
          New to Fb Helpdesk ? <a href="/singup">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
