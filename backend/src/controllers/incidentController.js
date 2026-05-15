const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const incidentRepository = require('../repositories/incidentRepository');
const IncidentFactory = require('../factories/incidentFactory');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/avi', 'video/mov', 'video/quicktime',
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3',
];

exports.getAll = async (req, reply) => {
  const incidents = await incidentRepository.findAll(req.query);
  return reply.send(incidents);
};

exports.getById = async (req, reply) => {
  const incident = await incidentRepository.findById(req.params.id);
  if (!incident) return reply.code(404).send({ error: 'Incidencia no encontrada' });
  return reply.send(incident);
};

exports.getStats = async (req, reply) => {
  const stats = await incidentRepository.getStats();
  return reply.send(stats);
};

exports.create = async (req, reply) => {
  try {
    const parts = req.parts();
    const fields = {};
    const savedFiles = [];

    for await (const part of parts) {
      if (part.file) {
        if (!ALLOWED_TYPES.includes(part.mimetype)) {
          await part.file.resume();
          continue;
        }
        const ext = path.extname(part.filename);
        const filename = `${uuidv4()}${ext}`;
        const filepath = path.join(UPLOADS_DIR, filename);
        const chunks = [];
        for await (const chunk of part.file) chunks.push(chunk);
        fs.writeFileSync(filepath, Buffer.concat(chunks));
        savedFiles.push({
          filename,
          originalName: part.filename,
          mimetype: part.mimetype,
          size: Buffer.concat(chunks).length,
          url: `http://localhost:5000/uploads/${filename}`,
        });
      } else {
        fields[part.fieldname] = part.value;
      }
    }

    const incidentData = IncidentFactory.create(fields);
    incidentData.media = savedFiles;
    const incident = await incidentRepository.create(incidentData);
    return reply.code(201).send(incident);
  } catch (err) {
    return reply.code(500).send({ error: err.message });
  }
};

exports.updateStatus = async (req, reply) => {
  const { status, comment, changedBy } = req.body;
  const validStatuses = ['pendiente', 'en_proceso', 'resuelto', 'cerrado'];
  if (!validStatuses.includes(status)) {
    return reply.code(400).send({ error: 'Estado inválido' });
  }
  const incident = await incidentRepository.updateStatus(req.params.id, status, comment || '', changedBy || 'Operador');
  if (!incident) return reply.code(404).send({ error: 'Incidencia no encontrada' });
  return reply.send(incident);
};

exports.uploadMedia = async (req, reply) => {
  try {
    const parts = req.parts();
    const savedFiles = [];
    for await (const part of parts) {
      if (part.file) {
        if (!ALLOWED_TYPES.includes(part.mimetype)) { await part.file.resume(); continue; }
        const ext = path.extname(part.filename);
        const filename = `${uuidv4()}${ext}`;
        const chunks = [];
        for await (const chunk of part.file) chunks.push(chunk);
        fs.writeFileSync(path.join(UPLOADS_DIR, filename), Buffer.concat(chunks));
        savedFiles.push({ filename, originalName: part.filename, mimetype: part.mimetype, size: Buffer.concat(chunks).length, url: `http://localhost:5000/uploads/${filename}` });
      }
    }
    const incident = await incidentRepository.addMedia(req.params.id, savedFiles[0]);
    return reply.send(incident);
  } catch (err) {
    return reply.code(500).send({ error: err.message });
  }
};

exports.remove = async (req, reply) => {
  const incident = await incidentRepository.delete(req.params.id);
  if (!incident) return reply.code(404).send({ error: 'Incidencia no encontrada' });
  return reply.code(204).send();
};
