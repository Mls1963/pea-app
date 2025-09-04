import React, { useState, useEffect } from "react";
import MouvementForm from "./components/MouvementForm";

function App() {
  // État du mode sombre
  const [darkMode, setDarkMode] = useState(true);

  // On peut sauvegarder la préférence dans localStorage
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) setDarkMode(stored === "true");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const montantTotal =
        parseFloat(formData.Cours || 0) * parseFloat(formData.Quantité || 0) +
        parseFloat(formData.Frais || 0);

      const res = await fetch(
        "https://api.baserow.io/api/database/rows/table/696/?user_field_names=true",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.REACT_APP_BASEROW_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            Montant_Total: montantTotal,
          }),
        }
      );

      if (!res.ok) throw new Error("Erreur lors de l’enregistrement");
      alert("Mouvement enregistré avec succès !");
    } catch (err) {
      console.error(err);
      alert("Échec de l’enregistrement");
    }
  };

  return (
    <div className={`${darkMode ? "dark bg-gray-900 text-gray-100" : "bg-white text-gray-900"} min-h-screen p-6 transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📈 Gestion PEA</h1>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300 transition-colors"
        >
          {darkMode ? "Mode clair" : "Mode sombre"}
        </button>
      </div>

      <MouvementForm onSubmit={handleFormSubmit} />
    </div>
  );
}

export default App;
