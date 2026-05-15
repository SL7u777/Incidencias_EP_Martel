const userRepository = require('../repositories/userRepository');

exports.login = async (req, reply) => {
  const { email, password } = req.body;

  const user = await userRepository.findByEmail(email);

  if (!user || user.password !== password) {
    return reply.code(401).send({ error: 'Credenciales incorrectas' });
  }

  if (user.role === 'ciudadano') {
    return reply.code(403).send({ error: 'Acceso denegado. Solo operadores y admins pueden gestionar incidencias.' });
  }

  return reply.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    district: user.district,
  });
};
