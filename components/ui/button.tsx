import * as React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline';
};

export const Button = ({ variant = 'default', className = '', ...props }: ButtonProps) => {
  const base = 'px-4 py-2 rounded text-white';
  const styles = variant === 'outline'
    ? 'border border-gray-400 text-gray-700 bg-white'
    : 'bg-blue-600 hover:bg-blue-700';
  return (
    <button className={`${base} ${styles} ${className}`} {...props} />
  );
};