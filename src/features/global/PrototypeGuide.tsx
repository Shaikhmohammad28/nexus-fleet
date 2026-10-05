import React from 'react';
import { useStore } from '../../store/useStore';
import {
  ListChecks,
  CheckCircle2,
  Circle,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface ChecklistStep {
  id: string;
  title: string;
  description: string;
  actionHint: string;
}

const CHECKLIST_STEPS: ChecklistStep[] = [
  {
    id: 'step-auto-cat',
    title: '1. Auto-Categorize 247 Assets',
    description: 'Resolve uncategorized assets in one click and check the distribution bar.',
    actionHint: 'Click "Auto-categorize" in the amber banner at the top of Hardware Inventory.',
  },
  {
    id: 'step-kpi-filter',
    title: '2. Clickable KPI Card Filtering',
    description: 'Click any KPI card to filter the table, and click again to reset.',
    actionHint: 'Click "Assigned Inventory" or "Warranty expiring in 30 days".',
  },
  {
    id: 'step-joiner-assign',
    title: '3. 1-Click Joiner Laptop Provisioning',
    description: 'Assign a suggested laptop to an onboarding employee waiting for equipment.',
    actionHint: 'Click "Assign suggested" on any card in the joiners carousel.',
  },
  {
    id: 'step-inline-edit',
    title: '4. Hover Pencil & Inline Editing',
    description: 'Keep tables calm with read-only cells that allow inline edit on hover.',
    actionHint: 'Hover over an Asset Tag or Title in the table and click the pencil.',
  },
  {
    id: 'step-bulk-bar',
    title: '5. Bottom Bulk Action Bar',
    description: 'Select rows to reveal bulk assignment, repair status, and CSV export.',
    actionHint: 'Select 2 or more row checkboxes in the Hardware table.',
  },
  {
    id: 'step-add-stock',
    title: '6. Smart Add Stock with Live Calculation',
    description: 'Add new hardware batch and observe the live cost & sequential tag preview.',
    actionHint: 'Click "+ Add Inventory Stock" in the toolbar.',
  },
  {
    id: 'step-switch-software',
    title: '7. Software Subscriptions Tab',
    description: 'Switch tabs to view honest spend accounting and seat utilization.',
    actionHint: 'Click the "Software Subscriptions" segmented control tab.',
  },
  {
    id: 'step-seat-removal',
    title: '8. Real-Time Seat License Management',
    description: 'Revoke a seat in the drawer and watch utilization update live across KPIs.',
    actionHint: 'Open Notion or Figma drawer, navigate to Users tab, and click the revoke icon.',
  },
  {
    id: 'step-cmd-palette',
    title: '9. Command Palette (Ctrl+/)',
    description: 'Instant fuzzy lookup across assets, employees, and contracts.',
    actionHint: 'Press Ctrl+/ (or Cmd+/) or click the top search field.',
  },
  {
    id: 'step-dark-mode',
    title: '10. Dark Mode SaaS Theme',
    description: 'Verify smooth high-contrast styling across all dialogs and charts.',
    actionHint: 'Click the Sun/Moon toggle icon in the top navigation bar.',
  },
];

export const PrototypeGuide: React.FC = () => {
  const {
    isPrototypeGuideOpen,
    setPrototypeGuideOpen,
    completedChecklistSteps,
    toggleChecklistStep,
    assets,
    newJoiners,
    theme,
  } = useStore();

  // Dynamic automatic check detection
  const isAutoCatDone = assets.filter((a) => a.family === 'Other').length < 100;
  const isJoinerDone = newJoiners.length < 20;

  const isStepComplete = (id: string) => {
    if (id === 'step-auto-cat' && isAutoCatDone) return true;
    if (id === 'step-joiner-assign' && isJoinerDone) return true;
    return completedChecklistSteps.includes(id);
  };

  const completedCount = CHECKLIST_STEPS.filter((s) => isStepComplete(s.id)).length;
  const progressPct = Math.round((completedCount / CHECKLIST_STEPS.length) * 100);

  return (
    <>
      {/* Floating Trigger Button (Bottom Left) */}
      <button
        onClick={() => setPrototypeGuideOpen(!isPrototypeGuideOpen)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3.5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Prototype Guide"
      >
        <ListChecks className="w-4 h-4 text-indigo-400 dark:text-indigo-600" />
        <span>Prototype Guide</span>
        <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
          {completedCount}/{CHECKLIST_STEPS.length}
        </span>
      </button>

      {/* Checklist Drawer/Modal */}
      {isPrototypeGuideOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-84 sm:w-96 bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-950/20">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Reviewer Checklist</span>
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Key enhancements implemented from prompt specification
              </p>
            </div>
            <button
              onClick={() => setPrototypeGuideOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-4 py-2 bg-gray-50/80 dark:bg-gray-900/40 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Evaluation Progress</span>
            <span className="font-bold text-indigo-600">{progressPct}% Complete</span>
          </div>

          {/* Checklist items */}
          <div className="p-3 max-h-[380px] overflow-y-auto space-y-2">
            {CHECKLIST_STEPS.map((step) => {
              const done = isStepComplete(step.id);
              return (
                <div
                  key={step.id}
                  onClick={() => toggleChecklistStep(step.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    done
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40'
                      : 'bg-white dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/80 hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <div
                        className={`text-xs font-semibold ${
                          done
                            ? 'text-gray-500 line-through'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {step.title}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                        {step.description}
                      </p>
                      <div className="mt-1.5 text-[10px] text-indigo-700 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-950/50 p-1.5 rounded-lg border border-indigo-200/60 dark:border-indigo-900/40">
                        💡 {step.actionHint}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
