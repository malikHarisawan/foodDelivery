const express = require('express');
const { updateProfile, deleteAccount, getUsers } = require('../controllers/userController');
const { authenticate, authorize } = require('../../../shared/middleware/auth');

const router = express.Router();

router.put('/profile', authenticate, updateProfile);
router.delete('/account', authenticate, deleteAccount);
router.get('/', authenticate, authorize('admin'), getUsers);

module.exports = router;