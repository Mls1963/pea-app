import React, { useState, useEffect } from "react";

const MouvementForm = () => {
  const [actifs, setActifs] = useState([]);
  const [formData, setFormData] = useState({
    Date: "",
    Actif: "",
    Quantité: "",
    Cours: "",
    Frais: "",
    Type: "",
    Commentaire: "",
  });

  useEffect(() => {
    const fetchActifs = async () => {
      try {
        const url = `${process.env.REACT_APP_BASEROW_API_URL}/database/rows/table/695/?user_field_names=true`;
        console.log("URL utilisée pour fetch actifs :", url);

        const response = await fetch(url, {
          headers: {
            Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`,
          },
        });

        const data = await response.json();
        console.log("Réponse Baserow actifs :", data);

        setActifs(data.results || []);
      } catch (error) {
        console.error("Erreur lors du chargement des actifs :", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calcul du montant total
    const montantTotal =
      parseFloat(formData.Quantité || 0) * parseFloat(formData.Cours || 0) +
      parseFloat(formData.Frais || 0);

    const mouvement = {
      ...formData,
      Montant_Total: montantTotal,
    };

    try {
      const url = `${process.env.REACT_APP_BASEROW_API_URL}/database/rows/table/702/?user_field_names=true`;
      console.log("URL utilisée pour POST mouvement :", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mouvement),
      });

      const data = await response.json();
      console.log("Mouvement ajouté :", data);

      alert("Mouvement ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout du mouvement :", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Ajouter un Mouvement
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Date</label>
            <input
              type="date"
              name="Date"
              value={formData.Date}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-2">Actif (Selecteur)</label>
            <select
              name="Actif"
              value={formData.Actif}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="">-- Choisir un actif --</option>
              {actifs.map((a) => (
                <option key={a.id} value={a.Selecteur}>
                  {a.Selecteur}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Quantité</label>
            <input
              type="number"
              name="Quantité"
              value={formData.Quantité}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-2">Cours</label>
            <input
              type="number"
              step="0.01"
              name="Cours"
              value={formData.Cours}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-2">Frais</label>
            <input
              type="number"
              step="0.01"
              name="Frais"
              value={formData.Frais}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-2">Type</label>
            <input
              type="text"
              name="Type"
              value={formData.Type}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-2">Commentaire</label>
            <textarea
              name="Commentaire"
              value={formData.Commentaire}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default MouvementForm;
