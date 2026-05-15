import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { incidentService } from '../services/api';
import { CATEGORY_COLORS, STATUS_COLORS, PRIORITY_COLORS, CATEGORY_ICONS } from '../components/IncidentCard';

function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    incidentService.getById(id)
      .then(r => setIncident(r.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Cargando...</div>;
  if (!incident) return null;

  const catColor = CATEGORY_COLORS[incident.category] || '#64748b';
  const statusColor = STATUS_COLORS[incident.status] || '#64748b';

  return (
    <div style={{ maxWidth: '800px', margin: '28px auto', padding: '0 20px 40px' }}>
      <button onClick={() => navigate(-1)} style={{ backgroundColor: 'transparent', border: 'none', color: '#64748b', fontSize: '14px', marginBottom: '16px', cursor: 'pointer' }}>← Volver</button>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `4px solid ${catColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '28px' }}>{CATEGORY_ICONS[incident.category]}</span>
              <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{incident.title}</h1>
            </div>
            <span style={{ fontSize: '12px', backgroundColor: catColor + '22', color: catColor, padding: '3px 10px', borderRadius: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
              {incident.category}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', backgroundColor: statusColor + '22', color: statusColor, padding: '5px 14px', borderRadius: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>
              {incident.status.replace('_', ' ')}
            </div>
            <div style={{ fontSize: '11px', color: PRIORITY_COLORS[incident.priority], fontWeight: '600' }}>⚡ Prioridad {incident.priority}</div>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>{incident.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Ubicación</div>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>{incident.location?.address}</div>
            {incident.location?.district && <div style={{ fontSize: '12px', color: '#64748b' }}>{incident.location.district}</div>}
          </div>
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Reportado por</div>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>{incident.reportedBy?.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{incident.reportedBy?.email}</div>
          </div>
        </div>

        {incident.media?.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '10px' }}>Evidencia multimedia</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {incident.media.map((m, i) => (
                <div key={i}>
                  {m.mimetype?.startsWith('image/') ? (
                    <img src={m.url} alt={m.originalName} style={{ height: '120px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                  ) : m.mimetype?.startsWith('video/') ? (
                    <video src={m.url} controls style={{ height: '120px', borderRadius: '6px' }} />
                  ) : m.mimetype?.startsWith('audio/') ? (
                    <audio src={m.url} controls style={{ width: '220px' }} />
                  ) : (
                    <a href={m.url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#6366f1' }}>📎 {m.originalName}</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {incident.statusHistory?.length > 0 && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '10px' }}>Historial de estados</div>
            <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '16px' }}>
              {[...incident.statusHistory].reverse().map((h, i) => (
                <div key={i} style={{ marginBottom: '10px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-21px', top: '3px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: STATUS_COLORS[h.status] || '#cbd5e0' }} />
                  <div style={{ fontSize: '12px', fontWeight: '700', color: STATUS_COLORS[h.status], textTransform: 'uppercase' }}>{h.status.replace('_', ' ')}</div>
                  {h.comment && <div style={{ fontSize: '12px', color: '#475569' }}>{h.comment}</div>}
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{h.changedBy} — {new Date(h.changedAt).toLocaleString('es-PE')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IncidentDetailPage;
