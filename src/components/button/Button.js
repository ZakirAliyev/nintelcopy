import React from "react";

function Button({ onClick, children, className, disabled, style }) {
  return (
    <button
      style={style}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
