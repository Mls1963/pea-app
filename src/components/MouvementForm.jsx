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
          `${process.env.REACT_APP_BASEROW_API_URL}/api/database/rows/table/695/?user_field_names=true`,
          {
            headers: {
              Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`
            }
          }
        );

        // Temporaire : afficher le texte reçu
        const text = await response.text();
        console.log("Réponse brute :", text);

        // Essayer de parser JSON si possible
        const data = JSON.parse(text);
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

    console.log("Mouvement à envoyer :", { ...formData, Montant: montantTotal });

    // Ici tu pourrais envoyer les données vers Baserow ou un backend
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: "#1e1e1e", color: "#fff", padding: "20px", borderRadius: "8px" }}>
      <div>
        <label>Actif :</label>
        <select name="Actif" value={formData.Actif} onChange={handleChange}>
          <option value="">Sélectionner un actif</option>
          {actifs.map((actif) => (
            <option key={actif.id} value={actif.id}>
              {actif.field_6759 || actif.field_6747 || `Actif ${actif.id}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Date :</label>
        <input type="date" name="Date" value={formData.Date} onChange={handleChange} />
      </div>

      <div>
        <label>Quantité :</label>
        <input type="number" name="Quantité" value={formData.Quantité} onChange={handleChange} />
      </div>

      <div>
        <label>Cours :</label>
        <input type="number" step="0.01" name="Cours" value={formData.Cours} onChange={handleChange} />
      </div>

      <div>
        <label>Frais :</label>
        <input type="number" step="0.01" name="Frais" value={formData.Frais} onChange={handleChange} />
      </div>

      <div>
        <label>Type :</label>
        <input type="text" name="Type" value={formData.Type} onChange={handleChange} />
      </div>

      <div>
        <label>Commentaire :</label>
        <textarea name="Commentaire" value={formData.Commentaire} onChange={handleChange}></textarea>
      </div>

      <button type="submit">Envoyer</button>
    </form>
  );
};

export default MouvementForm;
