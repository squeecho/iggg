import * as React from 'react';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ className = '', ...props }: LabelProps) => (
  <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props} />
);