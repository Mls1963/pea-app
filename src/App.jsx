import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import DashboardPEA from "./DashboardPEA";
import MouvementForm from "./MouvementForm";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPEA />} />
        <Route path="/saisie" element={<MouvementForm />} />
        <Route path="/parametres" element={<h2 style={{ color: "#f5f5f5", padding: "2rem" }}>⚙️ Page Paramètres</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
