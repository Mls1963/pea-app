import React, { useEffect, useState } from "react";

const MouvementForm = () => {
  const [actifs, setActifs] = useState([]);
  const [formData, setFormData] = useState({
    Actif: "",
    Date: "",
    Quantité: "",
    Cours: "",
    Frais: "",
    Type: "",
    Commentaire: ""
  });

  // Chargement des actifs depuis Baserow
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
        setActifs(data.results || []);
      } catch (error) {
        console.error("Erreur lors du chargement des actifs :", error);
      }
    };
    fetchActifs();
  }, []);

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calcul du montant total
    const montantTotal =
      parseFloat(formData.Cours || 0) * parseFloat(formData.Quantité || 0) +
      parseFloat(formData.Frais || 0);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEROW_URL}/api/database/rows/table/696/?user_field_names=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`
          },
          body: JSON.stringify({
            Actif: [formData.Actif], // ⚠️ on envoie l'id, pas le Selecteur
            Date: formData.Date,
            Quantité: formData.Quantité,
            Cours: formData.Cours,
            Frais: formData.Frais,
            Type: formData.Type,
            Commentaire: formData.Commentaire,
            Montant_Total: montantTotal
          })
        }
      );

      if (response.ok) {
        alert("Mouvement enregistré avec succès !");
        setFormData({
          Actif: "",
          Date: "",
          Quantité: "",
          Cours: "",
          Frais: "",
          Type: "",
          Commentaire: ""
        });
      } else {
        console.error("Erreur API :", await response.text());
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Saisir un mouvement</h2>

      <label className="block mb-2">Actif</label>
      <select
        name="Actif"
        value={formData.Actif}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded text-black"
        required
      >
        <option value="">-- Sélectionner un actif --</option>
        {actifs.map((actif) => (
          <option key={actif.id} value={actif.id}>
            {actif.Selecteur}
          </option>
        ))}
      </select>

      <label className="block mb-2">Date</label>
      <input
        type="date"
        name="Date"
        value={formData.Date}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded text-black"
        required
      />

      <label className="block mb-2">Quantité</label>
      <input
        type="number"
        name="Quantité"
        value={formData.Quantité}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded text-black"
        required
      />

      <label className="block mb-2">Cours (€)</label>
      <input
        type="number"
        step="0.01"
        name="Cours"
        value={formData.Cours}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded text-black"
        required
      />

      <label className="block mb-2">Frais (€)</label>
      <input
        type="number"
        step="0.01"
        name="Frais"
        value={formData.Frais}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded text-black"
      />

      <label className="block mb-2">Type</label>
      <input
        type="text"
        name="Type"
        value={formData.Type}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded text-black"
      />

      <label className="block mb-2">Commentaire</label>
      <textarea
        name="Commentaire"
        value={formData.Commentaire}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded text-black"
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-lg"
      >
        Enregistrer
      </button>
    </form>
  );
};

export default MouvementForm;
