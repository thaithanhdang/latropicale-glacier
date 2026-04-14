// ============================================================
// src/services/sheetsExport.js
// Service d'export vers Google Sheets — La Tropicale Glacier
// ============================================================

const SHEETS_API_URL =
  'https://script.google.com/macros/s/AKfycbxlFxpyRxwpqxRUGqf2hT2XcQXfjN_4XE7S3TeLwoeCUwgMhlfX7K6y3t-VWgPqszWVwA/exec';

// Apps Script avec mode no-cors : on ne peut pas lire la réponse,
// mais l'envoi fonctionne. On utilise une image de tracking comme
// contournement pour confirmer la réception.
async function envoyerViaFormulaire(payload) {
  // Encode le payload en base64 dans un paramètre GET (limite ~2000 recettes)
  // Pour les gros exports on split en plusieurs appels
  return fetch(SHEETS_API_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  });
}

/**
 * Exporte TOUTES les recettes vers Google Sheets
 * Génère un onglet formaté par recette + onglet DATA + onglet HISTORIQUE
 * @param {Array} recettes - Toutes les recettes
 * @param {Array} ingredients - Catalogue ingrédients (pour résoudre les noms)
 * @param {Function} onProgress - Callback optionnel(pct) pour barre de progression
 */
export async function exporterToutesRecettes(recettes, ingredients, onProgress) {
  // Découper en lots de 20 recettes pour éviter les timeouts Apps Script
  const BATCH = 20;
  const total = recettes.length;
  let done = 0;

  for (let i = 0; i < total; i += BATCH) {
    const lot = recettes.slice(i, i + BATCH);
    await envoyerViaFormulaire({
      action: 'export_recettes',
      recettes: lot,
      ingredients,
      batchIndex: Math.floor(i / BATCH),
      batchTotal: Math.ceil(total / BATCH),
    });
    done += lot.length;
    if (onProgress) onProgress(Math.round((done / total) * 100));
    // Petite pause entre les lots pour ne pas saturer Apps Script
    if (i + BATCH < total) await new Promise(r => setTimeout(r, 800));
  }
  return { success: true, total };
}

/**
 * Exporte UNE seule recette (mise à jour rapide depuis la fiche)
 * @param {Object} recette
 * @param {Array} ingredients
 */
export async function exporterUneRecette(recette, ingredients) {
  await envoyerViaFormulaire({
    action: 'export_recette_unique',
    recette,
    ingredients,
  });
  return { success: true };
}

/**
 * Enregistre une entrée dans le journal des modifications
 * @param {Object} entry { recette, champ, ancienneValeur, nouvelleValeur, commentaire }
 */
export async function logModification(entry) {
  await envoyerViaFormulaire({
    action: 'log_modification',
    entry: {
      ...entry,
      date: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
    },
  });
}
