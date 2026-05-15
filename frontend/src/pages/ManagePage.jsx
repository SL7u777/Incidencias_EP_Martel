import React, { useState, useEffect } from 'react';
import { incidentService } from '../services/api';
import { STATUS_COLORS, CATEGORY_ICONS } from '../components/IncidentCard';
import { useNavigate } from 'react-router-dom';

const STATUSES = ['pendiente', 'en_proceso', 'resuelto', 'cerrado'];

function ManagePage() {
  const [incidents, setIncidents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [operator, setOperator] = useState('Operador');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const load = () => {
    incidentService.getAll().then(r => setIncidents(r.data)).catch(console.error);
  };

  useEffect(() => { load(); }, []);

  const handleUpdate = async () => {
    if (!selected || !newStatus) return;
    setLoading(true);
    setMsg('');
    try {
      await incidentService.updateStatus(selected._id, { status: newStatus, comment, changedBy: operator });
      setMsg('Estado actualizado correctamente');
      setSelected(null);
      setNewStatus('');
      setComment('');
      load();
    } catch (e) {
      setMsg('Error al actualizar estado');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '28px auto', padding: '0 20px 40px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>Gestionar Incidencias</h2>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>US-003: Actualizar estado de incidencias reportadas</p>

      {msg && (
        <div style={{ backgroundColor: msg.includes('Error') ? '#fef2f2' : '#f0fdf4', color: msg.includes('Error') ? '#b91c1c' : '#15803d', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', fontWeight: '600' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        <div>
          {incidents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '10px', color: '#64748b' }}>No hay incidencias</div>
          ) : (
            incidents.map(inc => (
              <div
                key={inc._id}
                onClick={() => { setSelected(inc); setNewStatus(inc.status); }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: selected?._id === inc._id ? '0 0 0 2px #f59e0b' : '0 1px 3px rgba(0,0,0,0.06)',
                  border: selected?._id === inc._id ? '2px solid #f59e0b' : '2px solid transparent',
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span>{CATEGORY_ICONS[inc.category]}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{inc.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>📍 {inc.location?.district || inc.location?.address}</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', backgroundColor: STATUS_COLORS[inc.status] + '22', color: STATUS_COLORS[inc.status], padding: '3px 8px', borderRadius: '10px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {inc.status.replace('_', ' ')}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ position: 'sticky', top: '20px' }}>
          {selected ? (
            <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: '#0f172a' }}>Actualizar estado</h3>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '12px' }}>{CATEGORY_ICONS[selected.category]} {selected.title}</div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Operador</label>
                <input value={operator} onChange={e => setOperator(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: '5px', fontSize: '13px' }} />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Nuevo estado</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => setNewStatus(s)} style={{ padding: '8px', borderRadius: '6px', border: `2px solid ${newStatus === s ? STATUS_COLORS[s] : '#e2e8f0'}`, backgroundColor: newStatus === s ? STATUS_COLORS[s] + '22' : 'white', color: newStatus === s ? STATUS_COLORS[s] : '#475569', fontWeight: '600', fontSize: '11px', cursor: 'pointer', textTransform: 'uppercase' }}>
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Comentario</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: '5px', fontSize: '13px', minHeight: '70px', resize: 'vertical' }} placeholder="Describe la acción tomada..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button onClick={() => navigate(`/incidents/${selected._id}`)} style={{ padding: '9px', borderRadius: '6px', border: '1.5px solid #e2e8f0', backgroundColor: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Ver detalle</button>
                <button onClick={handleUpdate} disabled={loading || !newStatus} style={{ padding: '9px', borderRadius: '6px', border: 'none', backgroundColor: loading ? '#94a3b8' : '#f59e0b', color: '#0f172a', fontSize: '12px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Guardando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '32px', textAlign: 'center', color: '#94a3b8', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👈</div>
              <div style={{ fontSize: '13px' }}>Selecciona una incidencia para actualizar su estado</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagePage;
