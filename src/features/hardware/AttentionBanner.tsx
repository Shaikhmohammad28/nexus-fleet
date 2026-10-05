import React from 'react';
import { useStore } from '../../store/useStore';
import { Sparkles, X, Filter, Zap, ArrowRight, Cpu } from 'lucide-react';

export const AttentionBanner: React.FC = () => {
  const {
    assets,
    hasDismissedAutoCategorizeBanner,
    setDismissAutoCategorizeBanner,
    setAutoCategorizeModalOpen,
    setActiveSavedViewId,
  } = useStore();

  const uncategorizedCount = assets.filter((a) => a.family === 'Other').length;

  if (hasDismissedAutoCategorizeBanner || uncategorizedCount === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 dark:from-amber-950/40 dark:via-indigo-950/40 dark:to-purple-950/30 border border-amber-300/80 dark:border-amber-700/60 rounded-2xl p-5 mb-6 shadow-sm transition-all duration-200">
      {/* Subtle background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Info & Rules preview */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shrink-0 shadow-md shadow-amber-500/25 mt-0.5">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/70 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60">
                Nexus AI Classification
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {uncategorizedCount} assets require product family classification
              </h4>
            </div>

            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Heuristic patterns detected. You can instantly map uncategorized assets to their correct hardware families with rollback support:
            </p>

            {/* Heuristic Rules Preview Tags */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                MacBook <ArrowRight className="w-3 h-3 text-indigo-500" /> Mac
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Dell / ThinkPad <ArrowRight className="w-3 h-3 text-blue-500" /> Windows
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Monitor / UltraFine <ArrowRight className="w-3 h-3 text-purple-500" /> Monitor
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end">
          <button
            onClick={() => setActiveSavedViewId('view-missing')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-xs"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Review manually</span>
          </button>

          <button
            onClick={() => setAutoCategorizeModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-md shadow-amber-500/20 transition-all focus:ring-2 focus:ring-amber-500"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Auto-categorize All</span>
          </button>

          <button
            onClick={() => setDismissAutoCategorizeBanner(true)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
            title="Dismiss banner"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
