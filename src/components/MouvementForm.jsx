import React, { useState, useEffect } from "react";

function MouvementForm() {
  const [actifs, setActifs] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    actif: "",
    quantite: "",
    prix: "",
    type: "achat",
  });

  useEffect(() => {
    const fetchActifs = async () => {
      try {
        const url = `${process.env.REACT_APP_BASEROW_API_URL}/api/database/rows/table/695/?user_field_names=true`;
        const apiKey = process.env.REACT_APP_BASEROW_API_KEY;

        console.log("---- DEBUG ENV ----");
        console.log("API URL:", process.env.REACT_APP_BASEROW_API_URL);
        console.log("API KEY:", apiKey ? "✔️ définie" : "❌ non définie");
        console.log("Full request URL:", url);

        const response = await fetch(url, {
          headers: {
            Authorization: `Token ${apiKey}`,
          },
        });

        const text = await response.text();
        console.log("Réponse brute :", text);

        try {
          const data = JSON.parse(text);
          console.log("Réponse JSON parsée :", data);
          setActifs(data.results || []);
        } catch (jsonError) {
          console.error("❌ Erreur lors du parsing JSON :", jsonError);
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des actifs :", error);
      }
    };

    fetchActifs();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mouvement soumis :", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Ajouter un mouvement</h2>
      <div className="mb-2">
        <label className="block">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="p-2 rounded text-black"
        />
      </div>
      <div className="mb-2">
        <label className="block">Actif</label>
        <select
          name="actif"
          value={formData.actif}
          onChange={handleChange}
          className="p-2 rounded text-black"
        >
          <option value="">-- Choisir un actif --</option>
          {actifs.map((a) => (
            <option key={a.id} value={a.Nom || a.id}>
              {a.Nom || `Actif ${a.id}`}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block">Quantité</label>
        <input
          type="number"
          name="quantite"
          value={formData.quantite}
          onChange={handleChange}
          className="p-2 rounded text-black"
        />
      </div>
      <div className="mb-2">
        <label className="block">Prix</label>
        <input
          type="number"
          name="prix"
          value={formData.prix}
          onChange={handleChange}
          className="p-2 rounded text-black"
        />
      </div>
      <div className="mb-2">
        <label className="block">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="p-2 rounded text-black"
        >
          <option value="achat">Achat</option>
          <option value="vente">Vente</option>
        </select>
      </div>
      <button type="submit" className="mt-4 p-2 bg-green-600 rounded">
        Enregistrer
      </button>
    </form>
  );
}

export default MouvementForm;
