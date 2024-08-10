const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fechaRecordatorio: { type: Date, required: true },
});

module.exports = mongoose.model('Reminder', reminderSchema);
