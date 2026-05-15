const Incident = require('../models/Incident');

class IncidentRepository {
  async findAll(filters = {}) {
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    return Incident.find(query).sort({ createdAt: -1 });
  }

  async findById(id) {
    return Incident.findById(id);
  }

  async create(data) {
    const incident = new Incident(data);
    return incident.save();
  }

  async updateStatus(id, status, comment, changedBy) {
    const incident = await Incident.findById(id);
    if (!incident) return null;
    incident.status = status;
    incident.statusHistory.push({ status, comment, changedBy });
    return incident.save();
  }

  async addMedia(id, mediaData) {
    return Incident.findByIdAndUpdate(
      id,
      { $push: { media: mediaData } },
      { new: true }
    );
  }

  async getStats() {
    const byCategory = await Incident.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const byStatus = await Incident.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const total = await Incident.countDocuments();
    return { total, byCategory, byStatus };
  }

  async delete(id) {
    return Incident.findByIdAndDelete(id);
  }
}

module.exports = new IncidentRepository();
