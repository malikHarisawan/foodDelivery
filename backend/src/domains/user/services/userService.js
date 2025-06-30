const User = require('../models/User');

class UserService {
  async updateProfile(userId, updates) {
    // Remove protected fields
    delete updates.password;
    delete updates.role;
    delete updates.email;

    const user = await User.findByIdAndUpdate(
      userId,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async deactivateAccount(userId) {
    const user = await User.findByIdAndUpdate(userId, { isActive: false });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUsers(filters) {
    const { role, page = 1, limit = 10 } = filters;
    const query = { isActive: true };
    
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total
      }
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUsersByRole(role) {
    const users = await User.find({ role, isActive: true }).select('-password');
    return users;
  }
}

module.exports = new UserService();