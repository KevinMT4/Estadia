const express = require('express');
const { createEvent, getEvents, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createEvent);
router.get('/', protect, getEvents);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
