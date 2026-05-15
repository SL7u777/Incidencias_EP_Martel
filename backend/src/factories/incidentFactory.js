const PRIORITY_MAP = {
  emergencia: 'critica',
  seguridad: 'alta',
  bache: 'media',
  alumbrado: 'media',
  basura: 'baja',
};

class IncidentFactory {
  static create(data) {
    return {
      title: data.title,
      description: data.description,
      category: data.category,
      status: 'pendiente',
      priority: PRIORITY_MAP[data.category] || 'media',
      location: {
        address: data.address,
        district: data.district || '',
        coordinates: {
          lat: data.lat ? parseFloat(data.lat) : null,
          lng: data.lng ? parseFloat(data.lng) : null,
        },
      },
      reportedBy: {
        name: data.reporterName,
        email: data.reporterEmail,
        phone: data.reporterPhone || '',
      },
      statusHistory: [{ status: 'pendiente', comment: 'Incidencia registrada', changedBy: data.reporterName }],
      media: [],
    };
  }
}

module.exports = IncidentFactory;
