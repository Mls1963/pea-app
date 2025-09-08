import React, { useEffect, useState } from "react";

const DashboardPEA = () => {
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMouvements = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEROW_URL}/api/database/rows/table/696/?user_field_names=true`,
          {
            headers: {
              Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`
            }
          }
        );
        const data = await response.json();
        setMouvements(data.results || []);
      } catch (error) {
        console.error("Erreur lors du chargement des mouvements :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMouvements();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          color: "#f5f5f5",
          backgroundColor: "#1e1e2f",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        ⏳ Chargement des données...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#12121c",
        color: "#f5f5f5",
        minHeight: "100vh",
        padding: "2rem"
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        📊 Dashboard PEA
      </h1>

      {mouvements.length === 0 ? (
        <p style={{ textAlign: "center" }}>Aucun mouvement enregistré.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#1e1e2f",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 0 12px rgba(0,0,0,0.5)"
          }}
        >
          <thead style={{ backgroundColor: "#2c2c3e" }}>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Actif</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Quantité</th>
              <th style={thStyle}>Cours</th>
              <th style={thStyle}>Frais</th>
              <th style={thStyle}>Montant Total</th>
              <th style={thStyle}>Commentaire</th>
            </tr>
          </thead>
          <tbody>
            {mouvements.map((mouvement) => (
              <tr key={mouvement.id} style={{ borderBottom: "1px solid #333" }}>
                <td style={tdStyle}>{mouvement.Date}</td>
                <td style={tdStyle}>{mouvement.Actif}</td>
                <td style={tdStyle}>{mouvement.Type}</td>
                <td style={tdStyle}>{mouvement.Quantité}</td>
                <td style={tdStyle}>{mouvement.Cours}</td>
                <td style={tdStyle}>{mouvement.Frais}</td>
                <td style={tdStyle}>{mouvement.Montant_Total}</td>
                <td style={tdStyle}>{mouvement.Commentaire}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "bold",
  color: "#4cafef",
  borderBottom: "2px solid #333"
};

const tdStyle = {
  padding: "10px",
  textAlign: "left"
};

export default DashboardPEA;
