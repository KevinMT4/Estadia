const Event = require('../models/Event');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

const createEvent = async (req, res, next) => {
    const { title, inicio, final, descripcion, color, userIds } = req.body;

    try {
        const event = await Event.create({
            title,
            inicio,
            final,
            descripcion,
            color,
            users: userIds,
        });

        await User.updateMany(
            { _id: { $in: userIds } },
            { $push: { events: event._id } }
        );

        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
};

const deleteEvent = async (req, res, next) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);

        if (!event) {
            return next(new ErrorResponse('Event not found', 404));
        }

        await event.remove();
        res.json({ message: 'Event removed' });
    } catch (error) {
        next(error);
    }
};

const getEvents = async (req, res, next) => {
    try {
        const events = await Event.find().populate('users');
        res.json(events);
    } catch (error) {
        next(error);
    }
};

module.exports = { createEvent, getEvents, deleteEvent };
