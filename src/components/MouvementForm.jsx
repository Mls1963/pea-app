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
        const url = `${process.env.REACT_APP_BASEROW_API_URL}/api/database/rows/table/695/?user_field_names=true`;
        console.log("🔍 URL utilisée pour récupérer les actifs :", url);
        console.log("🔑 API Key utilisée :", process.env.REACT_APP_BASEROW_API_KEY);

        const response = await fetch(url, {
          headers: {
            Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`,
            "Content-Type": "application/json"
          }
        });

        const text = await response.text(); // lecture brute
        console.log("📩 Réponse brute reçue :", text);

        const data = JSON.parse(text); // tentative de parse JSON
        console.log("✅ Données JSON parsées :", data);

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
      [e.target.name]: e.target.value
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const montantTotal =
      parseFloat(formData.Cours || 0) * parseFloat(formData.Quantité || 0) +
      parseFloat(formData.Frais || 0);

    console.log("📤 Données envoyées :", { ...formData, Montant: montantTotal });

    // Ici tu pourras rajouter l’appel POST vers Baserow
  };

  return (
    <div style={{ backgroundColor: "#121212", color: "#fff", padding: "20px" }}>
      <h2>Saisie d’un Mouvement</h2>
      <form onSubmit={handleSubmit}>
        {/* Sélecteur d’actifs */}
        <div>
          <label>Actif : </label>
          <select name="Actif" value={formData.Actif} onChange={handleChange}>
            <option value="">-- Choisir un actif --</option>
            {actifs.map((actif) => (
              <option key={actif.id} value={actif.id}>
                {actif.Nom || actif.field_6747 || "Sans nom"}
              </option>
            ))}
          </select>
        </div>

        {/* Autres champs */}
        <div>
          <label>Date : </label>
          <input type="date" name="Date" value={formData.Date} onChange={handleChange} />
        </div>

        <div>
          <label>Quantité : </label>
          <input type="number" name="Quantité" value={formData.Quantité} onChange={handleChange} />
        </div>

        <div>
          <label>Cours : </label>
          <input type="number" step="0.01" name="Cours" value={formData.Cours} onChange={handleChange} />
        </div>

        <div>
          <label>Frais : </label>
          <input type="number" step="0.01" name="Frais" value={formData.Frais} onChange={handleChange} />
        </div>

        <div>
          <label>Type : </label>
          <select name="Type" value={formData.Type} onChange={handleChange}>
            <option value="">-- Choisir --</option>
            <option value="Achat">Achat</option>
            <option value="Vente">Vente</option>
            <option value="Dividende">Dividende</option>
          </select>
        </div>

        <div>
          <label>Commentaire : </label>
          <input type="text" name="Commentaire" value={formData.Commentaire} onChange={handleChange} />
        </div>

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
};

export default MouvementForm;
