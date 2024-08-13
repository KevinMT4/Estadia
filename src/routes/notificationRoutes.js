const express = require('express');
const { createNotification, getNotifications } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', createNotification);
router.get('/', getNotifications);

module.exports = router;
