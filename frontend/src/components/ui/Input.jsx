import React from 'react';

const Input = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  containerClassName = '',
  type = 'text',
  ...props 
}) => {
  const inputClasses = `
    block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    ${error 
      ? 'border-red-300 text-red-900 focus:ring-red-500' 
      : 'border-gray-300 text-gray-900'
    }
    ${className}
  `;

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;