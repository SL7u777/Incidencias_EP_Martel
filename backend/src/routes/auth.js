const ctrl = require('../controllers/authController');

module.exports = async function (fastify) {
  fastify.post(
    '/login',
    {
      schema: {
        tags: ['auth'],
        summary: 'Login para operadores y admins',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 1 },
          },
        },
      },
    },
    ctrl.login
  );
};
