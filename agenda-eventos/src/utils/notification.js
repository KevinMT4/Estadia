// Esta es una función de ejemplo que envía una notificación por correo electrónico
// Puedes reemplazar esto con la integración real del servicio de correo electrónico que prefieras

import emailjs from 'emailjs-com'; // Puedes usar cualquier servicio de email

export const sendNotification = (email, event) => {
  const templateParams = {
    to_email: email,
    subject: 'Recordatorio de evento próximo',
    message: `El evento ${event.title} está programado para ${event.start.toLocaleString()} - ${event.end.toLocaleString()}.`,
  };

  emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID')
    .then((response) => {
      console.log('Correo enviado!', response.status, response.text);
    }, (err) => {
      console.error('Error al enviar el correo:', err);
    });
};
