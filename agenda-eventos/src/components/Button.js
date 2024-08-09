import React from 'react';
import '../styles/Button.css'; // Ruta corregida

const Button = ({ variant, className, children, ...props }) => {
  return (
    <button className={`btn ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
