const ctrl = require('../controllers/userController');

module.exports = async function (fastify) {
  fastify.get(
    '/',
    { schema: { tags: ['users'], summary: 'Listar usuarios' } },
    ctrl.getAll
  );

  fastify.post(
    '/',
    {
      schema: {
        tags: ['users'],
        summary: 'Registrar usuario',
        body: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['ciudadano', 'operador', 'admin'] },
            phone: { type: 'string' },
            district: { type: 'string' },
          },
        },
      },
    },
    ctrl.create
  );

  fastify.get(
    '/operators',
    { schema: { tags: ['users'], summary: 'Listar operadores y admins' } },
    ctrl.getOperators
  );
};
