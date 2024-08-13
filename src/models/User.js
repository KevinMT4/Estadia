const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const debug = require('debug')('app:userModel');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    events: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
        },
    ],
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        debug('Password not modified for user ID: %s', this._id);
        return next();
    }

    try {
        debug('Generating salt for user ID: %s', this._id);
        const salt = await bcrypt.genSalt(10);
        
        debug('Hashing password for user ID: %s', this._id);
        this.password = await bcrypt.hash(this.password, salt);

        debug('Password hashed successfully for user ID: %s', this._id);
        next();
    } catch (err) {
        debug('Error occurred while hashing password for user ID: %s. Error: %O', this._id, err);
        next(err);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    try {
        const trimmedPassword = enteredPassword.trim();
debug('Trimmed entered password:', trimmedPassword);
        debug('Stored password hash for user ID: %s is %s', this._id, this.password);
        debug('Comparing entered password: %s with stored password: %s', enteredPassword, this.password);
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        debug('Password comparison result for user ID: %s is %s', this._id, isMatch);
        return isMatch;
    } catch (err) {
        debug('Error occurred while comparing password for user ID: %s. Error: %O', this._id, err);
        throw err;
    }
};


module.exports = mongoose.model('User', userSchema);
