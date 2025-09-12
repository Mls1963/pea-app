import React, { useState, useEffect } from "react";

function MouvementForm() {
  const [actifs, setActifs] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    actif: "",
    quantite: "",
    cours: "",
    frais: "",
    type: "achat",
    commentaire: "",
    montant_total: 0,
  });

  // Chargement des actifs depuis Baserow
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
          headers: { Authorization: `Token ${apiKey}` },
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

  // Gestion des changements et recalcul du montant total
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    if (["quantite", "cours", "frais"].includes(name)) {
      const q = parseFloat(newFormData.quantite || 0);
      const c = parseFloat(newFormData.cours || 0);
      const f = parseFloat(newFormData.frais || 0);
      newFormData.montant_total = (q * c + f).toFixed(2);
    }

    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mouvement soumis :", formData);

    // Ici tu peux faire un POST vers Baserow ou autre backend
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">Ajouter un mouvement</h2>

        <div>
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="p-2 rounded text-black w-full"
          />
        </div>

        <div>
          <label>Actif *</label>
          <select
            name="actif"
            value={formData.actif}
            onChange={handleChange}
            required
            className="p-2 rounded text-black w-full"
          >
            <option value="">-- Choisir un actif --</option>
            {actifs.map((a) => (
              <option key={a.id} value={a.field_6759 || a.id}>
                {a.field_6759} - {a.field_6747} {/* code unique + nom */}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Quantité *</label>
          <input
            type="number"
            name="quantite"
            value={formData.quantite}
            onChange={handleChange}
            required
            className="p-2 rounded text-black w-full"
          />
        </div>

        <div>
          <label>Cours *</label>
          <input
            type="number"
            name="cours"
            value={formData.cours}
            onChange={handleChange}
            required
            className="p-2 rounded text-black w-full"
          />
        </div>

        <div>
          <label>Frais *</label>
          <input
            type="number"
            name="frais"
            value={formData.frais}
            onChange={handleChange}
            required
            className="p-2 rounded text-black w-full"
          />
        </div>

        <div>
          <label>Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="p-2 rounded text-black w-full"
          >
            <option value="achat">Achat</option>
            <option value="vente">Vente</option>
          </select>
        </div>

        <div>
          <label>Commentaire</label>
          <input
            type="text"
            name="commentaire"
            value={formData.commentaire}
            onChange={handleChange}
            className="p-2 rounded text-black w-full"
          />
        </div>

        <div>
          <label>Montant Total</label>
          <input
            type="text"
            name="montant_total"
            value={formData.montant_total}
            readOnly
            className="p-2 rounded text-black w-full bg-gray-700"
          />
        </div>

        <button
          type="submit"
          className="mt-2 p-2 bg-green-600 rounded w-full font-bold hover:bg-green-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}

export default MouvementForm;
