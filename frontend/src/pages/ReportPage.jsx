import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentService } from '../services/api';

const CATEGORIES = ['bache', 'alumbrado', 'basura', 'seguridad', 'emergencia'];
const CATEGORY_LABELS = { bache: 'Bache', alumbrado: 'Alumbrado', basura: 'Basura', seguridad: 'Seguridad', emergencia: 'Emergencia' };
const ACCEPTED_TYPES = 'image/*,video/*,audio/*';

function ReportPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'bache', address: '', district: '', reporterName: '', reporterEmail: '', reporterPhone: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    if (f.type.startsWith('image/')) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.address || !form.reporterName || !form.reporterEmail) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('file', file);
      const res = await incidentService.create(fd);
      navigate(`/incidents/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar incidencia.');
    } finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e0', borderRadius: '6px', fontSize: '14px' };
  const lbl = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.4px' };

  return (
    <div style={{ maxWidth: '720px', margin: '28px auto', padding: '0 20px 40px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>Reportar Incidencia</h2>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>US-001: Registro de incidencias en la vía pública</p>

      <form onSubmit={handleSubmit}>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '24px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Categoría</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {CATEGORIES.map(c => (
              <button key={c} type="button" onClick={() => setForm({ ...form, category: c })} style={{ padding: '10px 4px', borderRadius: '7px', border: `2px solid ${form.category === c ? '#f59e0b' : '#e2e8f0'}`, backgroundColor: form.category === c ? '#fef3c7' : 'white', fontWeight: '600', fontSize: '12px', cursor: 'pointer', color: form.category === c ? '#92400e' : '#475569' }}>
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '24px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detalles</h3>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div><label style={lbl}>Título *</label><input name="title" value={form.title} onChange={handleChange} style={inp} placeholder="Ej: Bache profundo en calzada, riesgo para vehículos y motociclistas" required /></div>
            <div><label style={lbl}>Descripción *</label><textarea name="description" value={form.description} onChange={handleChange} style={{ ...inp, minHeight: '90px', resize: 'vertical' }} placeholder="Ej: Bache de aprox. 40 cm de diámetro y 15 cm de profundidad, presente desde hace 2 semanas. Genera riesgo para motos y bicicletas." required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div><label style={lbl}>Dirección *</label><input name="address" value={form.address} onChange={handleChange} style={inp} placeholder="Ej: Av. Arequipa 2356, frente al grifo Primax" required /></div>
              <div><label style={lbl}>Distrito</label><input name="district" value={form.district} onChange={handleChange} style={inp} placeholder="Ej: Miraflores" /></div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '24px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Evidencia multimedia (opcional)</h3>
          <label style={{ display: 'block', border: '2px dashed #cbd5e0', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', backgroundColor: file ? '#f0fdf4' : '#f8fafc' }}>
            <input type="file" accept={ACCEPTED_TYPES} onChange={handleFile} style={{ display: 'none' }} />
            {file ? (
              <div>
                {preview && <img src={preview} alt="preview" style={{ maxHeight: '160px', borderRadius: '6px', marginBottom: '8px' }} />}
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#10b981' }}>{file.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Arrastra o haz clic para adjuntar</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Imagen, video o audio — máx. 50 MB</div>
              </div>
            )}
          </label>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '24px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tus datos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={lbl}>Nombre *</label><input name="reporterName" value={form.reporterName} onChange={handleChange} style={inp} placeholder="Ej: Carlos Ramírez Torres" required /></div>
            <div><label style={lbl}>Teléfono</label><input name="reporterPhone" value={form.reporterPhone} onChange={handleChange} style={inp} placeholder="Ej: 987 654 321" /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Email *</label><input type="email" name="reporterEmail" value={form.reporterEmail} onChange={handleChange} style={inp} placeholder="Ej: carlos.ramirez@gmail.com" required /></div>
          </div>
        </div>

        {error && <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px' }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: loading ? '#94a3b8' : '#f59e0b', color: '#0f172a', border: 'none', borderRadius: '7px', fontSize: '15px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Enviando...' : 'Registrar Incidencia'}
        </button>
      </form>
    </div>
  );
}

export default ReportPage;
