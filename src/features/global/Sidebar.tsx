import React from 'react';
import { useStore } from '../../store/useStore';
import {
  Laptop,
  Sparkles,
  UserCheck,
  PackagePlus,
  BarChart3,
  ShieldCheck,
  Sun,
  Moon,
  HelpCircle,
  Bug,
  ChevronLeft,
  ChevronRight,
  Zap,
  Globe,
  Sliders,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onScrollToJoiners?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onScrollToJoiners,
}) => {
  const {
    activeTab,
    setActiveTab,
    assets,
    subscriptions,
    newJoiners,
    theme,
    toggleTheme,
    setHelpOpen,
    setReportIssueOpen,
    setAddStockModalOpen,
    openAddSubscriptionModal,
    setAutoCategorizeModalOpen,
    softwareView,
    setSoftwareView,
    setStockAlertSettingsOpen,
  } = useStore();

  const totalAssets = assets.length;
  const assignedAssets = assets.filter((a) => a.status === 'Assigned').length;
  const unassignedAssets = assets.filter((a) => a.status === 'Available').length;
  const inRepairAssets = assets.filter((a) => a.status === 'In repair').length;
  const uncategorizedCount = assets.filter((a) => a.family === 'Other').length;
  const overdueJoiners = newJoiners.filter((j) => j.overdue).length;

  // Monthly SaaS spend calculation
  const monthlySaaS = subscriptions.reduce((acc, s) => {
    if (s.status === 'Cancelled' || s.status === 'Expired') return acc;
    if (s.billingCycle === 'Monthly') return acc + s.amount;
    if (s.billingCycle === 'Quarterly') return acc + s.amount / 3;
    if (s.billingCycle === 'Yearly') return acc + s.amount / 12;
    return acc;
  }, 0);

  return (
    <aside
      className={`relative z-20 flex flex-col bg-white dark:bg-[#0D121F] border-r border-slate-200/90 dark:border-slate-800/80 transition-all duration-300 ease-in-out select-none shrink-0 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} border-b border-slate-100 dark:border-slate-800/70`}>
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo Mark */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                  Nexus Fleet
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  v2.5
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate block">
                Enterprise IT Ops
              </span>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* When collapsed, small expand button centered below header */}
      {collapsed && (
        <div className="py-2 flex justify-center border-b border-slate-100 dark:border-slate-800/70">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Organization Badge (when expanded) */}
      {!collapsed && (
        <div className="px-4 pt-3.5 pb-2">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2 truncate">
              <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">Nexus Global Ops</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Fleet Synced" />
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div className={`flex-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-3'} py-3 space-y-6 scrollbar-thin`}>
        {/* Core Modules */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Fleet Systems
            </div>
          )}

          {/* 1. Hardware Inventory */}
          <button
            onClick={() => setActiveTab('hardware')}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center px-0' : 'justify-between px-3'
            } py-2.5 rounded-xl text-xs font-semibold transition-all group ${
              activeTab === 'hardware'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Hardware Fleet Inventory"
          >
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
              <Laptop className={`w-4 h-4 shrink-0 ${activeTab === 'hardware' ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}`} />
              {!collapsed && <span className="truncate">Hardware Fleet</span>}
            </div>
            {!collapsed && (
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                  activeTab === 'hardware'
                    ? 'bg-indigo-700 text-indigo-100'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {totalAssets}
              </span>
            )}
          </button>

          {/* 2. Software Subscriptions */}
          <button
            onClick={() => setActiveTab('software')}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center px-0' : 'justify-between px-3'
            } py-2.5 rounded-xl text-xs font-semibold transition-all group ${
              activeTab === 'software'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Software Subscriptions & SaaS"
          >
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
              <Sparkles className={`w-4 h-4 shrink-0 ${activeTab === 'software' ? 'text-white' : 'text-purple-500 dark:text-purple-400'}`} />
              {!collapsed && <span className="truncate">SaaS & Licenses</span>}
            </div>
            {!collapsed && (
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                  activeTab === 'software'
                    ? 'bg-indigo-700 text-indigo-100'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {subscriptions.length}
              </span>
            )}
          </button>

          {/* 3. Onboarding Queue */}
          <button
            onClick={() => {
              setActiveTab('hardware');
              if (onScrollToJoiners) onScrollToJoiners();
            }}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center px-0' : 'justify-between px-3'
            } py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-all`}
            title="Joiners Waiting for Inventory"
          >
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
              <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              {!collapsed && <span className="truncate">Joiner Queue</span>}
            </div>
            {!collapsed && overdueJoiners > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
                {overdueJoiners}
              </span>
            )}
          </button>

          {/* 4. Analytics & Spend Insights */}
          <button
            onClick={() => {
              setActiveTab('software');
              setSoftwareView('insights');
            }}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center px-0' : 'justify-between px-3'
            } py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'software' && softwareView === 'insights'
                ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Spend Analytics & Fleet Charts"
          >
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
              <BarChart3 className="w-4 h-4 text-cyan-500 shrink-0" />
              {!collapsed && <span className="truncate">Spend Insights</span>}
            </div>
            {!collapsed && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                ${Math.round(monthlySaaS / 1000)}k/mo
              </span>
            )}
          </button>
        </div>

        {/* Quick Operations & Actions */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Quick Operations
            </div>
          )}

          {/* Add Stock */}
          <button
            onClick={() => setAddStockModalOpen(true)}
            className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-all text-left`}
            title="Ingest Hardware Stock"
          >
            <PackagePlus className="w-4 h-4 text-indigo-500 shrink-0" />
            {!collapsed && <span>+ Ingest Stock</span>}
          </button>

          {/* Add Subscription */}
          <button
            onClick={() => openAddSubscriptionModal()}
            className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-all text-left`}
            title="Add SaaS Subscription"
          >
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            {!collapsed && <span>+ Add SaaS License</span>}
          </button>

          {/* Stock Alert Config */}
          <button
            onClick={() => setStockAlertSettingsOpen(true)}
            className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-all text-left`}
            title="Alert Thresholds"
          >
            <Sliders className="w-4 h-4 text-slate-400 shrink-0" />
            {!collapsed && <span>Stock Thresholds</span>}
          </button>
        </div>

        {/* Dynamic Reconciliation Card (when expanded) */}
        {!collapsed && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-slate-50 dark:from-indigo-950/30 dark:to-slate-900/40 border border-indigo-100 dark:border-indigo-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Fleet Reconciled
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                100%
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mb-2.5">
              Live identity holds across all updates:
              <span className="font-mono block mt-1 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                Total ({totalAssets}) = {assignedAssets} assigned + {unassignedAssets} available
              </span>
            </p>

            {uncategorizedCount > 0 && (
              <button
                onClick={() => setAutoCategorizeModalOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold transition-colors shadow-xs"
              >
                <Zap className="w-3 h-3" />
                <span>Auto-categorize ({uncategorizedCount})</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Profile & Utilities */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Controls row */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-1`}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {!collapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setHelpOpen(true)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                title="Keyboard Shortcuts (?)"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setReportIssueOpen(true)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                title="Report Bug / Feedback"
              >
                <Bug className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div
          className={`flex items-center ${
            collapsed ? 'justify-center p-1' : 'gap-3 px-2 py-1.5'
          } rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            PB
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                Pratik Bhatt
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Lead Infra Architect
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
