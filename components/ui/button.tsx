import * as React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
};

export const Button = ({ children, className = '', variant = 'default', size = 'md', onClick }: ButtonProps) => {
  const variantClass = variant === 'outline'
    ? 'border border-gray-400 text-gray-700 bg-white'
    : 'bg-blue-600 text-white';

  const sizeClass = size === 'sm'
    ? 'text-sm px-3 py-1.5'
    : size === 'lg'
    ? 'text-lg px-5 py-3'
    : 'text-base px-4 py-2';

  return (
    <button
      className={`rounded ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};