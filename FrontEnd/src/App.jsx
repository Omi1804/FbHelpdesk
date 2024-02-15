import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register, Login } from "./Components";
import "./App.css";
import Integration from "./Components/FbIntegration/Integration";

const App = () => {
  return (
    <div className="appComponent">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Integration />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
