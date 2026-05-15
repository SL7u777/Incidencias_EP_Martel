import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_BADGE = { admin: { label: 'Admin', color: '#dc2626' }, operador: { label: 'Operador', color: '#2563eb' } };

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const publicLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/report', label: '+ Reportar' },
  ];

  return (
    <nav style={{ backgroundColor: '#0f172a', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px' }}>
        <span style={{ color: '#f59e0b' }}>Incidencias</span> Viales
      </Link>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {publicLinks.map(({ to, label }) => (
          <Link key={to} to={to} style={{ color: pathname === to ? '#f59e0b' : '#94a3b8', textDecoration: 'none', padding: '6px 16px', borderRadius: '5px', fontSize: '14px', fontWeight: '600', backgroundColor: pathname === to ? 'rgba(245,158,11,0.1)' : 'transparent' }}>
            {label}
          </Link>
        ))}

        {user ? (
          <>
            <Link to="/manage" style={{ color: pathname === '/manage' ? '#f59e0b' : '#94a3b8', textDecoration: 'none', padding: '6px 16px', borderRadius: '5px', fontSize: '14px', fontWeight: '600', backgroundColor: pathname === '/manage' ? 'rgba(245,158,11,0.1)' : 'transparent' }}>
              Gestionar
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px', paddingLeft: '12px', borderLeft: '1px solid #334155' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '700', backgroundColor: ROLE_BADGE[user.role]?.color || '#475569', color: 'white', padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>
                  {ROLE_BADGE[user.role]?.label || user.role}
                </span>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{user.name}</div>
              </div>
              <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: '1px solid #475569', color: '#94a3b8', padding: '4px 10px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' }}>
                Salir
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" style={{ backgroundColor: '#1e293b', color: '#94a3b8', textDecoration: 'none', padding: '6px 14px', borderRadius: '5px', fontSize: '13px', fontWeight: '600', border: '1px solid #334155' }}>
            Operadores
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
