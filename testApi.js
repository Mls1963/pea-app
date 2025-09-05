process.env.REACT_APP_BASEROW_API_KEY
const tableId = 695;

fetch(`https://baserow.mlsapp.net/api/database/rows/table/${tableId}/`, {
  headers: { Authorization: `Token ${apiKey}` },
})
  .then(res => res.json())
  .then(data => console.log("Actifs récupérés :", data.results))
  .catch(err => console.error("Erreur API :", err));
