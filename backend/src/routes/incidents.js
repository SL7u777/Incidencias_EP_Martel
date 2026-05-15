const ctrl = require('../controllers/incidentController');
const { requireOperator } = require('../middleware/authMiddleware');

module.exports = async function (fastify) {
  fastify.get(
    '/',
    {
      schema: {
        tags: ['incidents'],
        summary: 'Listar todas las incidencias',
        querystring: {
          type: 'object',
          properties: {
            category: { type: 'string', enum: ['bache', 'alumbrado', 'basura', 'seguridad', 'emergencia'] },
            status: { type: 'string', enum: ['pendiente', 'en_proceso', 'resuelto', 'cerrado'] },
            priority: { type: 'string', enum: ['baja', 'media', 'alta', 'critica'] },
          },
        },
      },
    },
    ctrl.getAll
  );

  fastify.get(
    '/stats',
    { schema: { tags: ['incidents'], summary: 'Estadísticas de incidencias' } },
    ctrl.getStats
  );

  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['incidents'],
        summary: 'Obtener incidencia por ID',
        params: { type: 'object', properties: { id: { type: 'string' } } },
      },
    },
    ctrl.getById
  );

  fastify.post(
    '/',
    {
      schema: {
        tags: ['incidents'],
        summary: 'Registrar nueva incidencia (US-001) — multipart/form-data con imagen, video o audio',
        consumes: ['multipart/form-data'],
        description: 'Campos requeridos: title, description, category, address, reporterName, reporterEmail. Campo opcional: file (imagen/video/audio, max 50MB)',
      },
      config: { rawBody: false },
    },
    ctrl.create
  );

  fastify.patch(
    '/:id/status',
    {
      preHandler: requireOperator,
      schema: {
        tags: ['incidents'],
        summary: 'Actualizar estado de incidencia (US-003) — requiere header x-user-email de operador/admin',
        params: { type: 'object', properties: { id: { type: 'string' } } },
        headers: {
          type: 'object',
          properties: {
            'x-user-email': { type: 'string', description: 'Email del operador autenticado (requerido)' },
          },
        },
        body: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['pendiente', 'en_proceso', 'resuelto', 'cerrado'] },
            comment: { type: 'string' },
            changedBy: { type: 'string' },
          },
        },
      },
    },
    ctrl.updateStatus
  );

  fastify.post(
    '/:id/media',
    {
      schema: {
        tags: ['incidents'],
        summary: 'Adjuntar archivo multimedia a incidencia existente',
        consumes: ['multipart/form-data'],
        params: { type: 'object', properties: { id: { type: 'string' } } },
      },
    },
    ctrl.uploadMedia
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['incidents'],
        summary: 'Eliminar incidencia',
        params: { type: 'object', properties: { id: { type: 'string' } } },
      },
    },
    ctrl.remove
  );
};
