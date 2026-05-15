const userRepository = require('../repositories/userRepository');

async function requireOperator(req, reply) {
  const email = req.headers['x-user-email'];

  if (!email) {
    return reply.code(401).send({ error: 'No autenticado. Se requiere email de operador.' });
  }

  const user = await userRepository.findByEmail(email);

  if (!user || user.role === 'ciudadano') {
    return reply.code(403).send({ error: 'Acceso denegado. Solo operadores y admins.' });
  }

  req.operator = user;
}

module.exports = { requireOperator };
