const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  mimetype: String,
  size: Number,
  url: String,
});

const incidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['bache', 'alumbrado', 'basura', 'seguridad', 'emergencia'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pendiente', 'en_proceso', 'resuelto', 'cerrado'],
      default: 'pendiente',
    },
    priority: {
      type: String,
      enum: ['baja', 'media', 'alta', 'critica'],
      default: 'media',
    },
    location: {
      address: { type: String, required: true },
      district: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    media: [mediaSchema],
    reportedBy: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
    },
    assignedTo: String,
    statusHistory: [
      {
        status: String,
        comment: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Incident', incidentSchema);
