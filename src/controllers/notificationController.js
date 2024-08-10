const Notification = require('../models/Notification');

const createNotification = async (req, res, next) => {
    const { eventId, horaNotificacion, metodo, estado } = req.body;

    try {
        const notification = await Notification.create({
            event: eventId,
            horaNotificacion,
            metodo,
            estado,
        });

        res.status(201).json(notification);
    } catch (error) {
        next(error);
    }
};

const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find().populate('event');
        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

module.exports = { createNotification, getNotifications };
