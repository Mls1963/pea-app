import React, { useEffect, useState } from "react";

const BASEROW_API_URL = "https://baseraw.mlsapp.net/api/database/rows/table";
const BASEROW_TOKEN = "TON_TOKEN_BASEROW"; // ⚠️ à remplacer

export default function DashboardPEA() {
  const [actifs, setActifs] = useState([]);

  useEffect(() => {
    fetch(`${BASEROW_API_URL}/695/?user_field_names=true`, {
      headers: { Authorization: `Token ${BASEROW_TOKEN}` }
    })
      .then((res) => res.json())
      .then((data) => setActifs(data.results || []));
  }, []);

  const totalValorisation = actifs.reduce(
    (sum, a) => sum + a.Quantité * (a.PU || 0),
    0
  );

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Synthèse PEA</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ISIN</th>
            <th className="p-2 border">Libellé</th>
            <th className="p-2 border">Quantité</th>
            <th className="p-2 border">PU (marché)</th>
            <th className="p-2 border">PRU</th>
            <th className="p-2 border">Valorisation</th>
            <th className="p-2 border">Gain latent</th>
          </tr>
        </thead>
        <tbody>
          {actifs.map((a) => {
            const valorisation = a.Quantité * (a.PU || 0);
            const gain = valorisation - a.Quantité * (a.PRU || 0);
            return (
              <tr key={a.id} className="text-center">
                <td className="border p-2">{a.ISIN}</td>
                <td className="border p-2">{a.Libellé}</td>
                <td className="border p-2">{a.Quantité}</td>
                <td className="border p-2">{a.PU?.toFixed(2)}</td>
                <td className="border p-2">{a.PRU?.toFixed(2)}</td>
                <td className="border p-2">{valorisation.toFixed(2)} €</td>
                <td
                  className={`border p-2 ${
                    gain >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {gain.toFixed(2)} €
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 font-bold text-lg">
        Total valorisation : {totalValorisation.toFixed(2)} €
      </div>
    </div>
  );
}
