import React from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, RotateCcw } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          danger: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
        };

        const icon = icons[toast.type || 'info'];

        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className="pointer-events-auto flex items-center justify-between gap-3 w-full bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-xl border border-gray-700/50 transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              {icon}
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-white">{toast.title}</span>
                {toast.message && (
                  <span className="text-gray-300 ml-1.5 font-normal">
                    {toast.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.undoAction && (
                <button
                  onClick={() => {
                    toast.undoAction?.();
                    removeToast(toast.id);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-300 hover:text-indigo-200 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-400"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-200 p-1 rounded-md transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
