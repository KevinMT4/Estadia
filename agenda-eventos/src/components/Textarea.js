import React from 'react';
import '../styles/Textarea.css'; // Ruta corregida

const Textarea = (props) => {
  return <textarea {...props} className="textarea" />;
};

export default Textarea;
