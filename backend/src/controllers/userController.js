const userRepository = require('../repositories/userRepository');

exports.getAll = async (req, reply) => {
  const users = await userRepository.findAll();
  return reply.send(users);
};

exports.create = async (req, reply) => {
  try {
    const existing = await userRepository.findByEmail(req.body.email);
    if (existing) return reply.code(409).send({ error: 'Email ya registrado' });
    const user = await userRepository.create(req.body);
    return reply.code(201).send(user);
  } catch (err) {
    return reply.code(500).send({ error: err.message });
  }
};

exports.getOperators = async (req, reply) => {
  const operators = await userRepository.findOperators();
  return reply.send(operators);
};
