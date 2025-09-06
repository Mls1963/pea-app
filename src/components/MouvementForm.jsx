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

    const montantTotal =
      parseFloat(formData.Cours || 0) * parseFloat(formData.Quantité || 0) +
      parseFloat(formData.Frais || 0);

    const rowData = {
      field_6745: formData.Actif,        // Code ISIN ou identifiant
      field_6746: formData.Type,         // Type de mouvement
      field_6747: formData.Quantité,     // Quantité
      field_6748: formData.Cours,        // Cours
      field_6749: formData.Frais,        // Frais
      field_6750: montantTotal,          // Montant total
      field_6751: formData.Commentaire,  // Commentaire
      field_6752: formData.Date          // Date
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEROW_URL}/api/database/rows/table/695/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`
          },
          body: JSON.stringify(rowData)
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur Baserow: ${response.status}`);
      }

      const result = await response.json();
      console.log("Mouvement ajouté :", result);

      // Réinitialiser le formulaire
      setFormData({
        Actif: "",
        Date: "",
        Quantité: "",
        Cours: "",
        Frais: "",
        Type: "",
        Commentaire: ""
      });

      alert("Mouvement ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout du mouvement :", error);
      alert("Erreur lors de l'ajout du mouvement. Vérifie la console.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Actif:
        <select name="Actif" value={formData.Actif} onChange={handleChange}>
          <option value="">-- Sélectionner un actif --</option>
          {actifs.map((actif) => (
            <option key={actif.id} value={actif.field_6745}>
              {actif.field_6747 || actif.field_6745}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date:
        <input type="date" name="Date" value={formData.Date} onChange={handleChange} />
      </label>

      <label>
        Quantité:
        <input type="number" step="any" name="Quantité" value={formData.Quantité} onChange={handleChange} />
      </label>

      <label>
        Cours:
        <input type="number" step="any" name="Cours" value={formData.Cours} onChange={handleChange} />
      </label>

      <label>
        Frais:
        <input type="number" step="any" name="Frais" value={formData.Frais} onChange={handleChange} />
      </label>

      <label>
        Type:
        <select name="Type" value={formData.Type} onChange={handleChange}>
          <option value="">-- Sélectionner le type --</option>
          <option value="Achat">Achat</option>
          <option value="Vente">Vente</option>
        </select>
      </label>

      <label>
        Commentaire:
        <textarea name="Commentaire" value={formData.Commentaire} onChange={handleChange} />
      </label>

      <button type="submit">Ajouter Mouvement</button>
    </form>
  );
};

export default MouvementForm;
