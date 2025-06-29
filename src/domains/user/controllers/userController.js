const User = require('../models/User');

const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.role;
    delete updates.email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });
    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { updateProfile, deleteAccount, getUsers };