const path = require('path');
require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');

fastify.register(require('@fastify/cors'), { origin: '*' });

fastify.register(require('@fastify/multipart'), {
  limits: { fileSize: 50 * 1024 * 1024 },
});

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '..', 'uploads'),
  prefix: '/uploads/',
});

fastify.register(require('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'Incidencias Viales API',
      description: 'API para el registro de incidencias en la vía pública',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:5000' }],
    tags: [
      { name: 'incidents', description: 'Gestión de incidencias' },
      { name: 'users', description: 'Gestión de usuarios' },
    ],
  },
});

fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/api-docs',
  uiConfig: { docExpansion: 'list' },
});

fastify.register(require('./routes/incidents'), { prefix: '/api/incidents' });
fastify.register(require('./routes/users'), { prefix: '/api/users' });

fastify.get('/', async () => ({ message: 'Incidencias API running', docs: '/api-docs' }));

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    fastify.log.info('MongoDB connected');

    const { seedDatabase } = require('./seed/seedData');
    await seedDatabase();

    await fastify.listen({ port: parseInt(process.env.PORT) || 5000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
