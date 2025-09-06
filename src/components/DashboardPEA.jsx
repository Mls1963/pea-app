import React, { useEffect, useState } from "react";

const DashboardPEA = () => {
  const [mouvements, setMouvements] = useState([]);
  const [actifsMap, setActifsMap] = useState({});
  const [filterActif, setFilterActif] = useState("all");

  // Chargement des actifs
  useEffect(() => {
    const fetchActifs = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEROW_URL}/api/database/rows/table/695/?user_field_names=true`,
          {
            headers: {
              Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`
            }
          }
        );
        const data = await response.json();
        const map = {};
        (data.results || []).forEach((actif) => {
          map[actif.id] = actif.Selecteur;
        });
        setActifsMap(map);
      } catch (error) {
        console.error("Erreur lors du chargement des actifs :", error);
      }
    };
    fetchActifs();
  }, []);

  // Chargement des mouvements
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
        // Tri par date décroissante
        const sorted = (data.results || []).sort((a, b) => new Date(b.Date) - new Date(a.Date));
        setMouvements(sorted);
      } catch (error) {
        console.error("Erreur lors du chargement des mouvements :", error);
      }
    };
    fetchMouvements();
  }, []);

  // Liste filtrée
  const filteredMouvements =
    filterActif === "all"
      ? mouvements
      : mouvements.filter((m) => m.Actif?.length && actifsMap[m.Actif[0]] === filterActif);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Tableau des mouvements</h2>

      {/* Filtre par actif */}
      <div className="mb-4">
        <label className="mr-2">Filtrer par actif :</label>
        <select
          value={filterActif}
          onChange={(e) => setFilterActif(e.target.value)}
          className="text-black px-2 py-1 rounded"
        >
          <option value="all">Tous</option>
          {Object.values(actifsMap).map((nom) => (
            <option key={nom} value={nom}>
              {nom}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="border border-gray-700 px-2 py-1">Actif</th>
            <th className="border border-gray-700 px-2 py-1">Date</th>
            <th className="border border-gray-700 px-2 py-1">Quantité</th>
            <th className="border border-gray-700 px-2 py-1">Cours (€)</th>
            <th className="border border-gray-700 px-2 py-1">Frais (€)</th>
            <th className="border border-gray-700 px-2 py-1">Type</th>
            <th className="border border-gray-700 px-2 py-1">Commentaire</th>
            <th className="border border-gray-700 px-2 py-1">Montant Total (€)</th>
          </tr>
        </thead>
        <tbody>
          {filteredMouvements.map((m) => (
            <tr key={m.id}>
              <td className="border border-gray-700 px-2 py-1">
                {m.Actif?.length ? actifsMap[m.Actif[0]] || "Inconnu" : "—"}
              </td>
              <td className="border border-gray-700 px-2 py-1">{m.Date}</td>
              <td className="border border-gray-700 px-2 py-1">{m.Quantité}</td>
              <td className="border border-gray-700 px-2 py-1">{m.Cours}</td>
              <td className="border border-gray-700 px-2 py-1">{m.Frais}</td>
              <td className="border border-gray-700 px-2 py-1">{m.Type}</td>
              <td className="border border-gray-700 px-2 py-1">{m.Commentaire}</td>
              <td className="border border-gray-700 px-2 py-1">{m.Montant_Total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardPEA;
