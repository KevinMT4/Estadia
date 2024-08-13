const express = require('express');
const { createEvent, getEvents, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', createEvent);
router.get('/', getEvents);
router.delete('/:id', deleteEvent);

module.exports = router;
