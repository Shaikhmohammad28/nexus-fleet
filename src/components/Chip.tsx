import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'indigo' | 'blue' | 'amber' | 'red' | 'gray' | 'purple' | 'emerald';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  dot = false,
  className = '',
  onClick,
  icon,
}) => {
  const variantStyles = {
    indigo: 'bg-[#E6F6F3] text-[#007564] border-[#99DBCF] dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    amber: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    red: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
    gray: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/80 dark:text-gray-300 dark:border-gray-700',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  }[variant];

  const dotColors = {
    indigo: 'bg-[#00A78E]',
    blue: 'bg-blue-600',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    gray: 'bg-gray-400',
    purple: 'bg-purple-600',
    emerald: 'bg-emerald-600',
  }[variant];

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantStyles} ${sizeStyles} ${
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      } ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors} shrink-0`} />}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
