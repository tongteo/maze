import React from 'react';
import classNames from 'classnames';

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-blue-500 hover:bg-blue-600 text-white disabled:hover:bg-blue-500': variant === 'primary',
          'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:hover:bg-gray-200': variant === 'secondary',
        }
      )}
    >
      {children}
    </button>
  );
};