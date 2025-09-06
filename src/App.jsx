import React, { useEffect, useState } from "react";
import DashboardPEA from "./components/DashboardPEA";
import MouvementForm from "./components/MouvementForm";

function App() {
  const [actifs, setActifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActifs = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEROW_API_URL}/database/rows/table/695/?user_field_names=true`,
          {
            headers: {
              Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        setActifs(data.results || []);
      } catch (error) {
        console.error("Erreur lors du chargement des actifs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActifs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion du PEA</h1>

      {loading ? (
        <p>Chargement des actifs...</p>
      ) : (
        <MouvementForm actifs={actifs} />
      )}

      <DashboardPEA />
    </div>
  );
}

export default App;
