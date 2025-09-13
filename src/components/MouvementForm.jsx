import React, { useEffect, useState } from "react";

const MouvementForm = () => {
  const [actifs, setActifs] = useState([]);
  const [formData, setFormData] = useState({
    actif: "",
    date: "",
    quantite: "",
    cours: "",
    frais: "",
    type: "",
    commentaire: "",
  });

  // Chargement des actifs depuis Baserow
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
        const data = await response.json();
        console.log("✅ Actifs récupérés :", data);
        setActifs(data.results || []);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des actifs :", error);
      }
    };
    fetchActifs();
  }, []);

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calcul du montant total
    const montantTotal =
      parseFloat(formData.cours || 0) * parseFloat(formData.quantite || 0) +
      parseFloat(formData.frais || 0);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEROW_API_URL}/database/rows/table/696/?user_field_names=true`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Actif: formData.actif, // <- Zone Selecteur field_6759
            Date: formData.date,
            Quantité: parseFloat(formData.quantite),
            Cours: parseFloat(formData.cours),
            Frais: parseFloat(formData.frais),
            Type: formData.type,
            Commentaire: formData.commentaire,
            Montant_Total: montantTotal,
          }),
        }
      );

      if (response.ok) {
        alert("✅ Mouvement enregistré avec succès !");
        setFormData({
          actif: "",
          date: "",
          quantite: "",
          cours: "",
          frais: "",
          type: "",
          commentaire: "",
        });
      } else {
        const errorData = await response.text();
        console.error("❌ Erreur API :", errorData);
        alert("Erreur lors de l'enregistrement du mouvement.");
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
      alert("Erreur réseau.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-4">➕ Saisie d’un mouvement</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {/* Sélecteur d'actif */}
        <div>
          <label className="block mb-1">Actif *</label>
          <select
            name="actif"
            value={formData.actif}
            onChange={handleChange}
            required
            className="p-2 rounded text-black w-full"
          >
            <option value="">-- Choisir un actif --</option>
            {actifs.map((a) => (
              <option key={a.id} value={a.field_6759}>
                {a.field_6759}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="p-2 rounded text-black w-full"
          />
        </div>

        {/* Quantité */}
        <div>
          <label className="block mb-1">Quantité *</label>
          <input
            type="number"
            name="quantite"
            value={formData.quantite}
            onChange={handleChange}
            required
            className="p-2 rounded text-black w-full"
          />
        </div>

        {/* Cours */}
        <div>
          <label className="block mb-1">Cours *</label>
          <input
            type="number"
            step="0.01"
            name="cours"
            value={formData.cours}
            onChange={handleChange}
            required
            className="p-2 rounded text-black w-full"
          />
        </div>

        {/* Frais */}
        <div>
          <label className="block mb-1">Frais *</label>
          <input
            type="number"
            step="0.01"
            name="frais"
            value={formData.frais}
            onChange={handleChange}
            required
            className="p-2 rounded text-black w-full"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block mb-1">Type *</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="p-2 rounded text-black w-full"
          />
        </div>

        {/* Commentaire */}
        <div>
          <label className="block mb-1">Commentaire</label>
          <textarea
            name="commentaire"
            value={formData.commentaire}
            onChange={handleChange}
            className="p-2 rounded text-black w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full"
        >
          💾 Enregistrer
        </button>
      </form>
    </div>
  );
};

export default MouvementForm;
