const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    horaNotificacion: { type: Date, required: true },
    metodo: { type: String, required: true },
    estado: { type: String, required: true },
});

module.exports = mongoose.model('Notification', notificationSchema);
