// src/App.jsx
import React from "react";
import MouvementForm from "./components/MouvementForm";
import DashboardPEA from "./components/DashboardPEA";

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <h1>📊 Suivi du PEA</h1>

      <section style={{ marginBottom: "40px" }}>
        <h2>➕ Saisir un mouvement</h2>
        <MouvementForm />
      </section>

      <section>
        <h2>📈 Tableau de bord</h2>
        <DashboardPEA />
      </section>
    </div>
  );
}

export default App;
