const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorHandler');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar la app
const app = express();

// Middlewares de seguridad
app.use(helmet());

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(hpp());

// Límite de peticiones para evitar ataques de fuerza bruta
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 100, // Límite de 100 peticiones por cada 10 minutos
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;
