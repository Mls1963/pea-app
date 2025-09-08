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
          `${process.env.REACT_APP_BASEROW_URL}/api/database/rows/table/695/`,
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
      Actif: formData.Actif,
      Date: formData.Date,
      Quantité: formData.Quantité,
      Cours: formData.Cours,
      Frais: formData.Frais,
      Type: formData.Type,
      Commentaire: formData.Commentaire,
      Montant_Total: montantTotal
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEROW_URL}/api/database/rows/table/696/?user_field_names=true`,
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

      await response.json();
      alert("Mouvement ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout du mouvement :", error);
      alert("Erreur lors de l'ajout du mouvement. Vérifie la console.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "1rem",
        maxWidth: "500px",
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: "12px",
        backgroundColor: "#1e1e2f",
        color: "#f5f5f5",
        boxShadow: "0 0 12px rgba(0,0,0,0.6)"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        ➕ Ajouter un Mouvement
      </h2>

      <label>
        Actif:
        <select
          name="Actif"
          value={formData.Actif}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
        >
          <option value="">-- Sélectionner un actif --</option>
          {actifs.map((actif) => (
            <option key={actif.id} value={actif.field_6759}>
              {actif.field_6759}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date:
        <input
          type="date"
          name="Date"
          value={formData.Date}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
        />
      </label>

      <label>
        Quantité:
        <input
          type="number"
          step="any"
          name="Quantité"
          value={formData.Quantité}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
        />
      </label>

      <label>
        Cours:
        <input
          type="number"
          step="any"
          name="Cours"
          value={formData.Cours}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
        />
      </label>

      <label>
        Frais:
        <input
          type="number"
          step="any"
          name="Frais"
          value={formData.Frais}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
        />
      </label>

      <label>
        Type:
        <select
          name="Type"
          value={formData.Type}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
        >
          <option value="">-- Sélectionner le type --</option>
          <option value="Achat">Achat</option>
          <option value="Vente">Vente</option>
        </select>
      </label>

      <label>
        Commentaire:
        <textarea
          name="Commentaire"
          value={formData.Commentaire}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            minHeight: "60px"
          }}
        />
      </label>

      <button
        type="submit"
        style={{
          padding: "10px",
          borderRadius: "6px",
          backgroundColor: "#4cafef",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        ✅ Enregistrer
      </button>
    </form>
  );
};

export default MouvementForm;
