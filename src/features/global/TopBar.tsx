import React from 'react';
import { useStore } from '../../store/useStore';
import { NotificationsPopover } from './NotificationsPopover';
import {
  Search,
  Undo2,
  Calendar,
  Layers,
  Laptop,
  Sparkles,
  ChevronRight,
  Plus,
  Menu,
} from 'lucide-react';

interface TopBarProps {
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const {
    activeTab,
    setActiveTab,
    softwareView,
    setCommandPaletteOpen,
    undoStack,
    performUndo,
    selectedMonth,
    selectedYear,
    setSelectedMonthYear,
    setAddStockModalOpen,
    openAddSubscriptionModal,
  } = useStore();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-[#0D121F]/85 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/80 transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Hamburger + Breadcrumbs */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors"
              title="Toggle sidebar"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Nexus Fleet</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {activeTab === 'hardware' ? 'Hardware Fleet' : 'Software SaaS'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">
              {activeTab === 'hardware' ? 'Live Grid' : (softwareView === 'list' ? 'Contracts' : 'Analytics')}
            </span>
          </div>

          {/* Quick Tab Pill (Mobile View) */}
          <div className="sm:hidden flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setActiveTab('hardware')}
              className={`p-1.5 rounded-md text-xs font-semibold ${
                activeTab === 'hardware'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Laptop className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('software')}
              className={`p-1.5 rounded-md text-xs font-semibold ${
                activeTab === 'software'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Global Command Search Bar */}
        <div className="flex-1 max-w-lg mx-2 sm:mx-4">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full h-9 flex items-center justify-between px-3.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 group"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
              <span className="truncate">Search devices, people, software, contracts...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shrink-0">
              Ctrl + /
            </kbd>
          </button>
        </div>

        {/* Right: Simulation Month/Year Controls + Global Undo + Notifications */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Software Calendar Simulation Controls (Visible on Software Tab) */}
          {activeTab === 'software' && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 h-9 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonthYear(Number(e.target.value), selectedYear)}
                className="bg-transparent border-0 py-0 pl-1 pr-3 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer h-full"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx} className="bg-white dark:bg-slate-900">
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedMonthYear(selectedMonth, Number(e.target.value))}
                className="bg-transparent border-0 py-0 pl-1 pr-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer h-full"
              >
                {[2024, 2025, 2026, 2027].map((yr) => (
                  <option key={yr} value={yr} className="bg-white dark:bg-slate-900">
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quick Undo Button (Appears whenever undo actions are available) */}
          {undoStack.length > 0 && (
            <button
              onClick={() => performUndo()}
              className="h-9 flex items-center gap-1.5 px-3 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-all shadow-xs animate-in fade-in"
              title={`Undo: ${undoStack[undoStack.length - 1].description}`}
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo ({undoStack.length})</span>
            </button>
          )}

          {/* Notifications Popover */}
          <div className="h-9 flex items-center">
            <NotificationsPopover />
          </div>

          {/* Primary Quick Action Button */}
          {activeTab === 'hardware' ? (
            <button
              onClick={() => setAddStockModalOpen(true)}
              className="h-9 hidden sm:flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Ingest Asset</span>
            </button>
          ) : (
            <button
              onClick={() => openAddSubscriptionModal()}
              className="h-9 hidden sm:flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Contract</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
