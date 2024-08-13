const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Cargar variables de entorno
dotenv.config();

// Importar modelos
const User = require('./models/User');
const Event = require('./models/Event');
const Notification = require('./models/Notification');
const Reminder = require('./models/Reminder');

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URI, {
})
    .then(() => {
        console.log('MongoDB connected');
        seedData();  // Ejecutar el script de inserción solo después de conectarse a la base de datos
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

// Crear el script de inserción
const seedData = async () => {
    try {
        // Limpiar la base de datos
        await User.deleteMany({});
        await Event.deleteMany({});
        await Notification.deleteMany({});
        await Reminder.deleteMany({});
        const hashedPassword = await bcrypt.hash('password1', 10);
        // Crear usuarios
        const user1 = new User({
            username: 'user1',
            email: 'user1@example.com',
            password: 'password1',
        });

        const user2 = new User({
            username: 'user2',
            email: 'user2@example.com',
            password: await bcrypt.hash('password2', 10),
        });

        const user3 = new User({
            username: 'user3',
            email: 'user3@example.com',
            password: await bcrypt.hash('password3', 10),
        });

        console.log('Generated Hash for user1:', user1.password);
        console.log('Generated Hash for user2:', user2.password);
        console.log('Generated Hash for user3:', user3.password);

        await user1.save();
        await user2.save();
        await user3.save();

        

        // Crear eventos
        const event1 = new Event({
            title: 'Event 1',
            inicio: new Date(),
            final: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 horas después
            descripcion: 'Descripción del Evento 1',
            color: '#FF5733',
            users: [user1._id, user2._id],
        });

        const event2 = new Event({
            title: 'Event 2',
            inicio: new Date(),
            final: new Date(new Date().getTime() + 3 * 60 * 60 * 1000), // 3 horas después
            descripcion: 'Descripción del Evento 2',
            color: '#33FF57',
            users: [user2._id, user3._id],
        });

        const event3 = new Event({
            title: 'Event 3',
            inicio: new Date(),
            final: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), // 4 horas después
            descripcion: 'Descripción del Evento 3',
            color: '#3357FF',
            users: [user1._id, user3._id],
        });

        await event1.save();
        await event2.save();
        await event3.save();

        // Asociar eventos a usuarios
        user1.events.push(event1._id, event3._id);
        user2.events.push(event1._id, event2._id);
        user3.events.push(event2._id, event3._id);

        await user1.save();
        await user2.save();
        await user3.save();

        // Crear recordatorios
        const reminder1 = new Reminder({
            event: event1._id,
            user: user1._id,
            fechaRecordatorio: new Date(new Date().getTime() + 1 * 60 * 60 * 1000), // 1 hora después
        });

        const reminder2 = new Reminder({
            event: event2._id,
            user: user2._id,
            fechaRecordatorio: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 horas después
        });

        const reminder3 = new Reminder({
            event: event3._id,
            user: user3._id,
            fechaRecordatorio: new Date(new Date().getTime() + 3 * 60 * 60 * 1000), // 3 horas después
        });

        await reminder1.save();
        await reminder2.save();
        await reminder3.save();

        // Asociar recordatorios a eventos
        event1.reminders.push(reminder1._id);
        event2.reminders.push(reminder2._id);
        event3.reminders.push(reminder3._id);

        await event1.save();
        await event2.save();
        await event3.save();

        // Crear notificaciones
        const notification1 = new Notification({
            event: event1._id,
            horaNotificacion: new Date(new Date().getTime() + 30 * 60 * 1000), // 30 minutos después
            metodo: 'email',
            estado: 'pending',
        });

        const notification2 = new Notification({
            event: event2._id,
            horaNotificacion: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hora después
            metodo: 'sms',
            estado: 'pending',
        });

        const notification3 = new Notification({
            event: event3._id,
            horaNotificacion: new Date(new Date().getTime() + 90 * 60 * 1000), // 1.5 horas después
            metodo: 'push',
            estado: 'pending',
        });

        await notification1.save();
        await notification2.save();
        await notification3.save();

        // Asociar notificaciones a eventos
        event1.notifications.push(notification1._id);
        event2.notifications.push(notification2._id);
        event3.notifications.push(notification3._id);

        await event1.save();
        await event2.save();
        await event3.save();

        console.log('Datos insertados correctamente');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};