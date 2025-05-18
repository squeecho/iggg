import * as React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = ({ children, className = '', variant = 'default', size = 'md', onClick, disabled = false }: ButtonProps) => {
  const variantClass = variant === 'outline'
    ? 'border border-gray-400 text-gray-700 bg-white'
    : 'bg-blue-600 text-white';

  const sizeClass = size === 'sm'
    ? 'text-sm px-3 py-1.5'
    : size === 'lg'
    ? 'text-lg px-5 py-3'
    : 'text-base px-4 py-2';

  const disabledClass = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:opacity-90 active:scale-[0.98] transition cursor-pointer';

  return (
    <button
      className={`rounded ${variantClass} ${sizeClass} ${disabledClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};