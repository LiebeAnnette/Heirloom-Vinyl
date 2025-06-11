// client/src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.js";
import SignupPage from "./pages/SignupPage.js";
import RecordLibrary from "./pages/RecordLibrary.js";

function App() {
  return (
    <Router>
      <div className="app-container" style={{ padding: "1rem" }}>
        <h1>🎵 Heirloom Records</h1>
        <Routes>
          <Route path="/" element={<RecordLibrary />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
