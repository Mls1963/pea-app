import React, { useEffect, useState } from "react";

const BASEROW_API_URL = "https://baseraw.mlsapp.net/api/database/rows/table";
const BASEROW_TOKEN = "TON_TOKEN_BASEROW"; // ⚠️ à remplacer par ton vrai token

export default function MouvementForm() {
  const [actifs, setActifs] = useState([]);
  const [form, setForm] = useState({
    Actif: "",
    Date: new Date().toISOString().split("T")[0],
    Quantité: 0,
    Cours: 0,
    Frais: 0,
    Type: "Achat",
    Commentaire: ""
  });

  // Charger les actifs depuis Baserow
  useEffect(() => {
    fetch(`${BASEROW_API_URL}/695/?user_field_names=true`, {
      headers: { Authorization: `Token ${BASEROW_TOKEN}` }
    })
      .then((res) => res.json())
      .then((data) => setActifs(data.results || []))
      .catch((err) => console.error("Erreur chargement Actifs:", err));
  }, []);

  // Calcul automatique du montant total
  const montantTotal = form.Quantité * form.Cours + parseFloat(form.Frais || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enregistrer le mouvement
    const mouvementPayload = {
      ...form,
      Montant_Total: montantTotal,
      Actif: [form.Actif] // relation vers la table Actifs (ID de la ligne)
    };

    await fetch(`${BASEROW_API_URL}/696/?user_field_names=true`, {
      method: "POST",
      headers: {
        Authorization: `Token ${BASEROW_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mouvementPayload)
    });

    // Récupérer l’actif concerné pour mise à jour
    const actif = actifs.find((a) => a.id === parseInt(form.Actif, 10));
    if (!actif) return;

    let newQuantite = actif.Quantité;
    let newPRU = actif.PRU;

    if (form.Type === "Achat") {
      const coutTotal = montantTotal;
      newQuantite = actif.Quantité + parseFloat(form.Quantité);
      newPRU =
        (actif.PRU * actif.Quantité + coutTotal) /
        (actif.Quantité + parseFloat(form.Quantité));
    } else if (form.Type === "Vente") {
      newQuantite = actif.Quantité - parseFloat(form.Quantité);
      if (newQuantite < 0) newQuantite = 0;
    } else if (form.Type === "Apport" || form.Type === "Dividende") {
      newQuantite = actif.Quantité + montantTotal;
    } else if (form.Type === "Frais") {
      newQuantite = actif.Quantité - montantTotal;
    }

    // Mise à jour de l’actif
    await fetch(`${BASEROW_API_URL}/695/${actif.id}/?user_field_names=true`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${BASEROW_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Quantité: newQuantite,
        PRU: newPRU
      })
    });

    alert("Mouvement enregistré et actif mis à jour !");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">Saisir un mouvement</h2>

      <select
        name="Actif"
        value={form.Actif}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      >
        <option value="">-- Choisir un actif --</option>
        {actifs.map((a) => (
          <option key={a.id} value={a.id}>
            {a.Selecteur}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="Date"
        value={form.Date}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <input
        type="number"
        name="Quantité"
        placeholder="Quantité"
        value={form.Quantité}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <input
        type="number"
        step="0.01"
        name="Cours"
        placeholder="Cours"
        value={form.Cours}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <input
        type="number"
        step="0.01"
        name="Frais"
        placeholder="Frais"
        value={form.Frais}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <select
        name="Type"
        value={form.Type}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option>Achat</option>
        <option>Vente</option>
        <option>Apport</option>
        <option>Dividende</option>
        <option>Frais</option>
      </select>

      <textarea
        name="Commentaire"
        placeholder="Commentaire"
        value={form.Commentaire}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <div className="font-bold">
        Montant total calculé : {montantTotal.toFixed(2)} €
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Enregistrer
      </button>
    </form>
  );
}
