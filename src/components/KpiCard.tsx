import React from 'react';

interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  infoTooltip?: string;
  badge?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  active = false,
  onClick,
  children,
  badge,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white dark:bg-[#111726] rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between h-full ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${
        active
          ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/25 shadow-md shadow-indigo-500/10'
          : 'border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="truncate">{title}</span>
              {badge}
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {value}
            </div>
            {subtitle && (
              <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </div>
            )}
          </div>

          {icon && (
            <div
              className={`p-2.5 rounded-xl transition-all duration-200 shrink-0 ${
                active
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60'
              }`}
            >
              {icon}
            </div>
          )}
        </div>
      </div>

      {children && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/70">
          {children}
        </div>
      )}
    </div>
  );
};
