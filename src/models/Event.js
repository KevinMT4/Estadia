const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    inicio: { type: Date, required: true },
    final: { type: Date, required: true },
    descripcion: { type: String },
    color: { type: String },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    reminders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reminder',
        },
    ],
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification',
        },
    ],
});

module.exports = mongoose.model('Event', eventSchema);
