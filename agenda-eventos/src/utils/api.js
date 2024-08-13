// src/utils/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.12:4000/api',  // Reemplaza con la URL base de tu API
    timeout: 10000,  // Tiempo de espera de 10 segundos
    headers: {
        'Content-Type': 'application/json',
        // Puedes añadir aquí cualquier otro header que necesites
    }
});

// Configuración de interceptores para manejar errores globalmente
api.interceptors.response.use(
    response => response,
    error => {
        // Manejo de errores globales
        if (error.response) {
            // El servidor respondió con un estado fuera del rango 2xx
            console.error('Error en la respuesta de la API', error.response);
        } else if (error.request) {
            // No hubo respuesta del servidor
            console.error('No se recibió respuesta del servidor', error.request);
        } else {
            // Algo ocurrió al configurar la solicitud
            console.error('Error en la solicitud', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
