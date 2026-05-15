const Incident = require('../models/Incident');
const User = require('../models/User');

const users = [
  { name: 'Admin Sistema', email: 'admin@incidencias.pe', role: 'admin', district: 'Miraflores' },
  { name: 'Operador Lima Centro', email: 'operador1@incidencias.pe', role: 'operador', district: 'Lima Centro' },
  { name: 'Juan Pérez', email: 'juan@gmail.com', role: 'ciudadano', district: 'San Isidro' },
];

const incidents = [
  {
    title: 'Bache profundo en Av. Arequipa',
    description: 'Gran bache de aproximadamente 50cm de diámetro y 20cm de profundidad que representa riesgo para vehículos y motociclistas.',
    category: 'bache',
    status: 'en_proceso',
    priority: 'media',
    location: { address: 'Av. Arequipa cuadra 25', district: 'Miraflores', coordinates: { lat: -12.1153, lng: -77.0282 } },
    reportedBy: { name: 'Juan Pérez', email: 'juan@gmail.com', phone: '987654321' },
    statusHistory: [
      { status: 'pendiente', comment: 'Incidencia registrada', changedBy: 'Juan Pérez' },
      { status: 'en_proceso', comment: 'Cuadrilla asignada', changedBy: 'Operador Lima Centro' },
    ],
    media: [],
  },
  {
    title: 'Poste de alumbrado apagado',
    description: 'Poste de luz en esquina completamente apagado desde hace 3 días. Zona oscura genera inseguridad en las noches.',
    category: 'alumbrado',
    status: 'pendiente',
    priority: 'media',
    location: { address: 'Jr. Lampa esq. Jr. Callao', district: 'Lima Cercado', coordinates: { lat: -12.0566, lng: -77.0286 } },
    reportedBy: { name: 'María García', email: 'maria@gmail.com', phone: '976543210' },
    statusHistory: [{ status: 'pendiente', comment: 'Incidencia registrada', changedBy: 'María García' }],
    media: [],
  },
  {
    title: 'Acumulación de basura en parque',
    description: 'Contenedores desbordados en el parque central. Mal olor y presencia de roedores.',
    category: 'basura',
    status: 'resuelto',
    priority: 'baja',
    location: { address: 'Parque Kennedy, Miraflores', district: 'Miraflores', coordinates: { lat: -12.1219, lng: -77.0300 } },
    reportedBy: { name: 'Carlos López', email: 'carlos@gmail.com' },
    statusHistory: [
      { status: 'pendiente', comment: 'Incidencia registrada', changedBy: 'Carlos López' },
      { status: 'en_proceso', comment: 'Limpieza programada', changedBy: 'Operador' },
      { status: 'resuelto', comment: 'Zona limpiada y contenedores vaciados', changedBy: 'Operador' },
    ],
    media: [],
  },
  {
    title: 'Sospechosos en zona residencial',
    description: 'Grupo de personas merodeando vehículos en la calle desde las 2am. Vecinos alarmados.',
    category: 'seguridad',
    status: 'pendiente',
    priority: 'alta',
    location: { address: 'Calle Los Pinos 234, San Borja', district: 'San Borja' },
    reportedBy: { name: 'Rosa Martínez', email: 'rosa@gmail.com', phone: '965432109' },
    statusHistory: [{ status: 'pendiente', comment: 'Incidencia registrada', changedBy: 'Rosa Martínez' }],
    media: [],
  },
  {
    title: 'Derrumbe parcial de muro',
    description: 'EMERGENCIA: Muro perimetral colapsó sobre la vereda. Paso bloqueado, posible riesgo para transeúntes.',
    category: 'emergencia',
    status: 'en_proceso',
    priority: 'critica',
    location: { address: 'Av. Brasil 1567, Breña', district: 'Breña', coordinates: { lat: -12.0753, lng: -77.0519 } },
    reportedBy: { name: 'Pedro Flores', email: 'pedro@gmail.com', phone: '954321098' },
    statusHistory: [
      { status: 'pendiente', comment: 'Incidencia registrada', changedBy: 'Pedro Flores' },
      { status: 'en_proceso', comment: 'Equipos de emergencia enviados', changedBy: 'Admin Sistema' },
    ],
    media: [],
  },
];

async function seedDatabase() {
  const incidentCount = await Incident.countDocuments();
  if (incidentCount > 0) return;

  await User.deleteMany({});
  await User.insertMany(users);

  await Incident.insertMany(incidents);
  console.log('Database seeded with incidents and users');
}

module.exports = { seedDatabase };
