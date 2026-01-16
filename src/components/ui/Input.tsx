import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <div className="w-full mb-4">
      {label && (
        <label 
          htmlFor={props.id} 
          className="block mb-2 text-sm font-medium text-dark-purple-900 dark:text-dark-purple-200"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <motion.input
          ref={inputRef}
          className={`
            block w-full rounded-md border border-dark-purple-300 dark:border-dark-purple-700 bg-white dark:bg-dark-purple-700 text-black dark:text-dark-purple-100 py-2 px-3
            focus:outline-none focus:ring-2 focus:ring-dark-purple-500 dark:focus:ring-dark-purple-400 focus:border-transparent
            transition-all duration-200
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'border-dark-purple-500 focus:ring-dark-purple-600' : ''}
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        {isFocused && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-dark-purple-600 dark:bg-dark-purple-400"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-dark-purple-600 dark:text-dark-purple-400">{error}</p>
      )}
    </div>
  );
};

export default Input;