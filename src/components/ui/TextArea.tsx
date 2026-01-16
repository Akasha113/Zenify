import React from 'react';
import { motion } from 'framer-motion';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };
    
    textarea.addEventListener('input', adjustHeight);
    adjustHeight();
    
    return () => {
      textarea.removeEventListener('input', adjustHeight);
    };
  }, []);

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
        <motion.textarea
          ref={textareaRef}
          className={`
            block w-full rounded-md border border-dark-purple-300 dark:border-dark-purple-700 bg-white dark:bg-dark-purple-700 text-black dark:text-dark-purple-100 py-2 px-3
            focus:outline-none focus:ring-2 focus:ring-dark-purple-500 dark:focus:ring-dark-purple-400 focus:border-transparent
            transition-all duration-200 min-h-[100px] resize-none
            ${error ? 'border-dark-purple-500 focus:ring-dark-purple-600' : ''}
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
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

export default TextArea;