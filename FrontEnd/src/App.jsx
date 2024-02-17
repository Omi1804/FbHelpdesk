import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Signup, Integration, Pages, Messenger } from "./Components";
import "./App.css";

const App = () => {
  return (
    <div className="appComponent">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Integration />} />
          <Route path="/pages" element={<Pages />} />
          <Route path="/pages/:pageId" element={<Messenger />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
