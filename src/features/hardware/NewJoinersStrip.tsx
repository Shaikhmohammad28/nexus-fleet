import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ChevronDown, ChevronUp, UserCheck, Laptop, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Chip } from '../../components/Chip';

export const NewJoinersStrip: React.FC = () => {
  const {
    newJoiners,
    assignSuggestedToJoiner,
    openAssignModal,
  } = useStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterMode, setFilterMode] = useState<'All' | 'This week' | 'Overdue'>('All');

  if (newJoiners.length === 0) return null;

  const filteredJoiners = newJoiners.filter((j) => {
    if (filterMode === 'Overdue') return j.overdue;
    if (filterMode === 'This week') return j.joinedDaysAgo <= 7;
    return true;
  });

  const overdueCount = newJoiners.filter((j) => j.overdue).length;

  return (
    <div id="joiners-section" className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 mb-6 shadow-sm transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/70">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                New Joiners Waiting for Inventory ({newJoiners.length})
              </h3>
              {overdueCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  {overdueCount} Overdue
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sorted by onboarding arrival. 1-click provisioning automatically decrements unassigned stock.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Filter chips */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs">
            {(['All', 'This week', 'Overdue'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                  filterMode === mode
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand joiners' : 'Collapse joiners'}
            aria-label={isCollapsed ? 'Expand joiners list' : 'Collapse joiners list'}
          >
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Horizontally scrollable cards */}
      {!isCollapsed && (
        <div className="pt-4 overflow-x-auto pb-2 flex items-stretch gap-4 scrollbar-thin">
          {filteredJoiners.length === 0 ? (
            <div className="w-full text-center py-6 text-xs text-slate-400">
              No joiners match "{filterMode}" filter.
            </div>
          ) : (
            filteredJoiners.map((joiner) => (
              <div
                key={joiner.id}
                className="min-w-[320px] max-w-[320px] bg-slate-50/70 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between self-stretch transition-all duration-200 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800/80 group"
              >
                <div>
                  {/* Top row: Avatar + Name + Overdue */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {joiner.avatar}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {joiner.name}
                        </h4>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {joiner.role} · <span className="font-medium text-slate-700 dark:text-slate-300">{joiner.department}</span>
                        </div>
                      </div>
                    </div>

                    {joiner.overdue && (
                      <Chip variant="red" size="sm" dot>
                        Overdue
                      </Chip>
                    )}
                  </div>

                  {/* Joined timing */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {joiner.joinedDaysAgo === 0
                        ? 'Joined today'
                        : `Joined ${joiner.joinedDaysAgo} days ago`}
                    </span>
                  </div>

                  {/* Suggested device line */}
                  <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/60 mb-3 text-xs shadow-xs">
                    <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                      <Laptop className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Suggested Equipment:</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {joiner.suggestedAssetTitle}
                    </div>
                    <div className="font-mono text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold">
                      {joiner.suggestedAssetTag}
                    </div>
                  </div>
                </div>

                {/* Card action buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => assignSuggestedToJoiner(joiner.id)}
                    className="w-full py-2 px-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all text-center shadow-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    Assign suggested
                  </button>
                  <button
                    onClick={() => openAssignModal({ joinerId: joiner.id })}
                    className="w-full py-2 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all text-center"
                  >
                    Choose device
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
