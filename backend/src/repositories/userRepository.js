const User = require('../models/User');

class UserRepository {
  async findAll() {
    return User.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    return User.findById(id);
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async create(data) {
    const user = new User(data);
    return user.save();
  }

  async findOperators() {
    return User.find({ role: { $in: ['operador', 'admin'] } });
  }
}

module.exports = new UserRepository();
