import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register'; // Importar el componente Register
import '@fortawesome/fontawesome-free/css/all.min.css';



const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email) => {
    setIsAuthenticated(true);
    localStorage.setItem('user', email); // Guardar usuario en localStorage
  };

  const handleRegister = (email) => {
    // Aquí puedes añadir la lógica de registro si es necesaria
    setIsAuthenticated(true);
    localStorage.setItem('user', email); // Guardar usuario en localStorage
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/app" element={isAuthenticated ? <App /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} /> {/* Nueva ruta para registro */}
      </Routes>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
