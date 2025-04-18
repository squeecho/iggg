import * as React from 'react';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ className = '', ...props }: LabelProps) => {
  return <label className={`block font-medium text-sm mb-1 ${className}`} {...props} />;
};