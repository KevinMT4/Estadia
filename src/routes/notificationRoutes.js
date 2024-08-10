const express = require('express');
const { createNotification, getNotifications } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createNotification);
router.get('/', protect, getNotifications);

module.exports = router;
