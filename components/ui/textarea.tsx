import * as React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className = '', ...props }, ref) => (
  <textarea
    ref={ref}
    className={`border rounded px-3 py-2 w-full resize-none ${className}`}
    {...props}
  />
));
Textarea.displayName = 'Textarea';