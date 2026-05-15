import React, { useState, useEffect } from 'react';
import { incidentService } from '../services/api';
import IncidentCard, { CATEGORY_COLORS, STATUS_COLORS } from '../components/IncidentCard';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['', 'bache', 'alumbrado', 'basura', 'seguridad', 'emergencia'];
const STATUSES = ['', 'pendiente', 'en_proceso', 'resuelto', 'cerrado'];

function DashboardPage() {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ category: '', status: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      const [incRes, statsRes] = await Promise.all([
        incidentService.getAll(params),
        incidentService.getStats(),
      ]);
      setIncidents(incRes.data);
      setStats(statsRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filters]);

  const statCards = stats ? [
    { label: 'Total', value: stats.total, color: '#6366f1' },
    ...( stats.byStatus?.map(s => ({ label: s._id.replace('_',' '), value: s.count, color: STATUS_COLORS[s._id] || '#64748b' })) || []),
  ] : [];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>Incidencias Viales</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>Sistema de registro de incidencias en la vía pública</p>
        </div>
        <button onClick={() => navigate('/report')} style={{ backgroundColor: '#f59e0b', color: '#0f172a', border: 'none', padding: '10px 22px', borderRadius: '7px', fontWeight: '700', fontSize: '14px' }}>
          + Reportar incidencia
        </button>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {statCards.map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '14px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} style={{ padding: '8px 14px', borderRadius: '6px', border: '1.5px solid #cbd5e0', fontSize: '13px', backgroundColor: 'white' }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'Todas las categorías'}</option>)}
        </select>
        <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={{ padding: '8px 14px', borderRadius: '6px', border: '1.5px solid #cbd5e0', fontSize: '13px', backgroundColor: 'white' }}>
          {STATUSES.map(s => <option key={s} value={s}>{s ? s.replace('_', ' ') : 'Todos los estados'}</option>)}
        </select>
        <button onClick={load} style={{ padding: '8px 16px', borderRadius: '6px', border: '1.5px solid #cbd5e0', backgroundColor: 'white', fontSize: '13px', cursor: 'pointer' }}>🔄 Actualizar</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Cargando...</div>
      ) : incidents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', backgroundColor: 'white', borderRadius: '10px' }}>
          No hay incidencias {filters.category || filters.status ? 'con esos filtros' : 'registradas'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
          {incidents.map(inc => <IncidentCard key={inc._id} incident={inc} />)}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
