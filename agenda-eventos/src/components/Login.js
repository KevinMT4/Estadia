import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';
import api from '../utils/api';  // Importa la instancia de Axios configurada

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(email, password);
      const response = await api.post('/auth/login', { email, password });   // Llama a la API para hacer login
      const { token, user } = response.data;  // Asume que la API devuelve un token y los datos del usuario

      // Guardar el token en localStorage o en el estado de la aplicación
      localStorage.setItem('token', token);
      onLogin(user);  // Llama al callback onLogin con los datos del usuario

      navigate('/app');  // Redirige al usuario a la aplicación principal
    } catch (error) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <h2>Bienvenido a la Agenda Digital</h2>
      <h2>Iniciar Sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-icon`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
    </div>
  );
};

export default Login;
