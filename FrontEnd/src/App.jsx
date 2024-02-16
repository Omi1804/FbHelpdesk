import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Signup } from "./Components";
import "./App.css";
import Integration from "./Components/FbIntegration/Integration";

const App = () => {
  return (
    <div className="appComponent">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Integration />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
