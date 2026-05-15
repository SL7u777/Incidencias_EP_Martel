import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_COLORS = { bache: '#f59e0b', alumbrado: '#6366f1', basura: '#10b981', seguridad: '#ef4444', emergencia: '#dc2626' };
const STATUS_COLORS = { pendiente: '#f59e0b', en_proceso: '#3b82f6', resuelto: '#10b981', cerrado: '#6b7280' };
const PRIORITY_COLORS = { baja: '#10b981', media: '#f59e0b', alta: '#ef4444', critica: '#dc2626' };

function IncidentCard({ incident }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/incidents/${incident._id}`)}
      style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '16px',
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        borderLeft: `4px solid ${CATEGORY_COLORS[incident.category] || '#cbd5e0'}`,
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{incident.title}</span>
        <span style={{ fontSize: '11px', fontWeight: '700', backgroundColor: STATUS_COLORS[incident.status] + '22', color: STATUS_COLORS[incident.status], padding: '3px 8px', borderRadius: '12px', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
          {incident.status.replace('_', ' ')}
        </span>
      </div>
      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {incident.description}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
        <span>{incident.location?.district || incident.location?.address}</span>
        <span style={{ color: PRIORITY_COLORS[incident.priority], fontWeight: '600' }}>{incident.priority}</span>
      </div>
      {incident.media?.length > 0 && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#6366f1' }}>{incident.media.length} archivo(s) adjunto(s)</div>
      )}
    </div>
  );
}

export { CATEGORY_COLORS, STATUS_COLORS, PRIORITY_COLORS };
export default IncidentCard;
