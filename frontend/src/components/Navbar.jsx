import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/report', label: '+ Reportar' },
  { to: '/manage', label: 'Gestionar' },
];

const cat = { bache: '#f59e0b', alumbrado: '#6366f1', basura: '#10b981', seguridad: '#ef4444', emergencia: '#dc2626' };

function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav style={{ backgroundColor: '#0f172a', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px' }}>
        🚧 <span style={{ color: '#f59e0b' }}>Incidencias</span> Viales
      </Link>
      <div style={{ display: 'flex', gap: '8px' }}>
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              color: pathname === to ? '#f59e0b' : '#94a3b8',
              textDecoration: 'none',
              padding: '6px 16px',
              borderRadius: '5px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: pathname === to ? 'rgba(245,158,11,0.1)' : 'transparent',
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export { cat };
export default Navbar;
