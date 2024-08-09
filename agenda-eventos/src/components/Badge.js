import React from 'react';
import '../styles/Badge.css'; // Ruta corregida

const Badge = ({ variant, className, children }) => {
  return <span className={`badge ${variant} ${className}`}>{children}</span>;
};

export default Badge;
