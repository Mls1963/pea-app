import React, { useState, useEffect } from "react";

const MouvementForm = ({ onSubmit }) => {
  const [actifs, setActifs] = useState([]);
  const [form, setForm] = useState({
    Actif: "",
    Date: new Date().toISOString().split("T")[0], // date du jour par défaut
    Quantité: "",
    Cours: "",
    Frais: "",
    Type: "",
    Commentaire: "",
  });

  // Charger les actifs depuis Baserow
  useEffect(() => {
    const fetchActifs = async () => {
      try {
        const res = await fetch(
          "https://baserow.mlsapp.net/api/database/rows/table/695/?user_field_names=true",
          {
            headers: {
              Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`,
            },
          }
        );
        const data = await res.json();
        if (data && data.results) {
          setActifs(data.results.map((row) => row.field_6759));
          console.log("Actifs récupérés :", data.results.map((row) => row.field_6759));
        }
      } catch (err) {
        console.error("Erreur de récupération des actifs :", err);
      }
    };

    fetchActifs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const montantTotal =
      parseFloat(form.Cours || 0) * parseFloat(form.Quantité || 0) +
      parseFloat(form.Frais || 0);

    const mouvementData = {
      ...form,
      Montant_Total: montantTotal,
    };

    try {
      // Envoyer le mouvement à Baserow
      const res = await fetch(
        "https://baserow.mlsapp.net/api/database/rows/table/696/?user_field_names=true",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mouvementData),
        }
      );

      if (!res.ok) throw new Error("Erreur lors de l’enregistrement du mouvement");

      alert(`Mouvement enregistré : Montant total = ${montantTotal} €`);

      // Mise à jour du PU ou quantité dans table Actifs (optionnel, peut être un autre endpoint)
      // Exemple simplifié :
      /*
      await fetch(
        `https://baserow.mlsapp.net/api/database/rows/table/695/${actif_id}/?user_field_names=true`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Quantité: nouvelleQuantité,
            PRU: nouveauPRU,
          }),
        }
      );
      */

      // Réinitialiser le formulaire
      setForm({
        Actif: "",
        Date: new Date().toISOString().split("T")[0],
        Quantité: "",
        Cours: "",
        Frais: "",
        Type: "",
        Commentaire: "",
      });
    } catch (err) {
      console.error(err);
      alert("Échec de l’enregistrement");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 text-white p-6 rounded-2xl shadow-md space-y-4"
    >
      <div>
        <label className="block mb-1">Actif</label>
        <select
          name="Actif"
          value={form.Actif}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        >
          <option value="">-- Sélectionner un actif --</option>
          {actifs.map((a, idx) => (
            <option key={idx} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Date</label>
        <input
          type="date"
          name="Date"
          value={form.Date}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Quantité</label>
        <input
          type="number"
          name="Quantité"
          value={form.Quantité}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Cours (€)</label>
        <input
          type="number"
          step="0.01"
          name="Cours"
          value={form.Cours}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Frais (€)</label>
        <input
          type="number"
          step="0.01"
          name="Frais"
          value={form.Frais}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1">Type</label>
        <select
          name="Type"
          value={form.Type}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        >
          <option value="">-- Choisir --</option>
          <option value="Achat">Achat</option>
          <option value="Vente">Vente</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Commentaire</label>
        <textarea
          name="Commentaire"
          value={form.Commentaire}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-bold"
      >
        Enregistrer
      </button>
    </form>
  );
};

export default MouvementForm;
