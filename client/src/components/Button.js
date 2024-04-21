import React from 'react';
import '../index.css'
const Button = ({ onClick, name }) => {
  return (
    <button onClick={onClick} className="my-button">
      {name}
    </button>
  );
};

export default Button;
