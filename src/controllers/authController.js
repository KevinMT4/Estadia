const debug = require('debug')('app:userController');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ErrorResponse = require('../utils/errorResponse');

const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        debug('Attempting to register user with email: %s', email);

        const userExists = await User.findOne({ email });

        if (userExists) {
            debug('User with email %s already exists', email);
            return next(new ErrorResponse('User already exists', 400));
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            debug('User created successfully with ID: %s', user._id);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            debug('Failed to create user');
            return next(new ErrorResponse('Invalid user data', 400));
        }
    } catch (error) {
        debug('Error occurred while registering user: %O', error);
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        debug('Starting login process for email: %s', email);

        // Check if both email and password are provided
        if (!email || !password) {
            debug('Missing email or password in request body');
            return next(new ErrorResponse('Please provide both email and password', 400));
        }

        // Attempt to find user by email
        const user = await User.findOne({ email });

        if (!user) {
            debug('No user found with email: %s', email);
            return next(new ErrorResponse('Invalid email or password', 401));
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            debug('Password mismatch for user ID: %s', user._id);
            return next(new ErrorResponse('Invalid email or password', 401));
        }

        // If everything is fine, generate a token and respond
        debug('Password match for user ID: %s. Generating token.', user._id);
        const token = generateToken(user._id);

        debug('Token generated successfully for user ID: %s', user._id);
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token,
        });
    } catch (error) {
        // Log the full error details and return a generic error response
        debug('Unhandled error during login process for email: %s. Error details: %O', email, error);

        // Check for specific error types and provide more detailed responses if needed
        if (error.name === 'MongoError') {
            return next(new ErrorResponse('Database error occurred during login', 500));
        }

        return next(error);
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        debug('Fetching profile for user ID: %s', req.user._id);

        const user = await User.findById(req.user._id).populate('events');

        if (user) {
            debug('User profile fetched successfully for user ID: %s', req.user._id);
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                events: user.events,
            });
        } else {
            debug('User not found with ID: %s', req.user._id);
            return next(new ErrorResponse('User not found', 404));
        }
    } catch (error) {
        debug('Error occurred while fetching user profile: %O', error);
        next(error);
    }
};

module.exports = { registerUser, loginUser, getUserProfile };
