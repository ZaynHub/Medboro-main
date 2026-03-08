interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled,
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseStyles = 'rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-400 to-teal-400 text-white hover:from-cyan-500 hover:to-teal-500',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    outline: 'border-2 border-cyan-500 text-cyan-600 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-7 py-3.5 text-lg'
  };
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={(e) => {
        // Only stop propagation if there's an explicit onClick handler
        // This allows Link navigation to work when Button is wrapped in Link
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      disabled={disabled}
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
    >
      {children}
    </button>
  );
}