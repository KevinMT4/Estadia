import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    // Aquí añadir lógica para registrar el usuario
    onRegister(email);
    navigate('/app');
  };

  return (
    <div className="login-container">
      <h2>Bienvenido a la Agenda Digital</h2>
      <h2>Registrarse</h2>
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <i
              className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} password-icon`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            ></i>
          </div>
        </div>
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link></p>
    </div>
  );
};

export default Register;
