const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ErrorResponse = require('../utils/errorResponse');

const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(new ErrorResponse('User already exists', 400));
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            return next(new ErrorResponse('Invalid user data', 400));
        }
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return next(new ErrorResponse('Invalid email or password', 401));
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        next(error);
    }
};

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).populate('events');

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            events: user.events,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };
