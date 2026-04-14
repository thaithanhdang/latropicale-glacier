// ============================================================
// src/components/BoutonExportSheets.jsx
// Bouton "Exporter vers Google Sheets" — La Tropicale Glacier
// ============================================================
// USAGE (dans Dashboard.jsx ou RecettesPage.jsx) :
//
//   import BoutonExportSheets from './components/BoutonExportSheets';
//
//   <BoutonExportSheets recettes={recettes} ingredients={ingredients} />
//
// ============================================================

import { useState } from 'react';
import { exporterToutesRecettes } from '../services/sheetsExport';

const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/15XE22A7uXv0NnZ_9H3qpNCCYxEeOqLNsAotFIrRK764/edit';

export default function BoutonExportSheets({ recettes = [], ingredients = [] }) {
  const [etat, setEtat] = useState('idle'); // idle | loading | succes | erreur
  const [progression, setProgression] = useState(0);
  const [nbExportes, setNbExportes] = useState(0);

  const handleExport = async () => {
    if (etat === 'loading') return;
    setEtat('loading');
    setProgression(0);

    try {
      const result = await exporterToutesRecettes(
        recettes,
        ingredients,
        (pct) => setProgression(pct)
      );
      setNbExportes(result.total);
      setEtat('succes');
      // Revenir à l'état normal après 6 secondes
      setTimeout(() => { setEtat('idle'); setProgression(0); }, 6000);
    } catch (err) {
      console.error('Export Sheets erreur:', err);
      setEtat('erreur');
      setTimeout(() => setEtat('idle'), 4000);
    }
  };

  // ── Styles ────────────────────────────────────────────────
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: etat === 'loading' ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    overflow: 'hidden',
  };

  const styles = {
    idle:    { ...base, background: '#1B3A2D', color: '#fff' },
    loading: { ...base, background: '#2D5A3D', color: '#fff' },
    succes:  { ...base, background: '#2D7A3D', color: '#fff' },
    erreur:  { ...base, background: '#8B1A1A', color: '#fff' },
  };

  const labels = {
    idle:    <>📊 Exporter vers Sheets</>,
    loading: <>⏳ Export… {progression}%</>,
    succes:  <>✅ {nbExportes} recettes exportées !</>,
    erreur:  <>❌ Erreur — réessayer</>,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <button style={styles[etat]} onClick={handleExport} disabled={etat === 'loading'}>
        {labels[etat]}
      </button>

      {/* Barre de progression */}
      {etat === 'loading' && (
        <div style={{ height: '4px', background: '#e0e0d0', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progression}%`,
            background: '#C8A84B',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      )}

      {/* Lien vers le Sheets après succès */}
      {etat === 'succes' && (
        <a
          href={SHEETS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '12px',
            color: '#2D7A3D',
            textDecoration: 'underline',
            textAlign: 'center',
          }}
        >
          Ouvrir Google Sheets →
        </a>
      )}
    </div>
  );
}
