import React, { useState } from 'react';
import { useStore } from './store/useStore';
import { TopBar } from './features/global/TopBar';
import { Sidebar } from './features/global/Sidebar';
import { ToastContainer } from './components/Toast';
import { SkeletonLoader } from './features/global/SkeletonLoader';
import { CommandPalette } from './features/global/CommandPalette';
import { ReportIssueModal } from './features/global/ReportIssueModal';
import { HelpShortcutsModal } from './features/global/HelpShortcutsModal';
import { StockAlertSettingsModal } from './features/global/StockAlertSettingsModal';
import { PrototypeGuide } from './features/global/PrototypeGuide';

// Hardware Features
import { AttentionBanner } from './features/hardware/AttentionBanner';
import { HardwareKpis } from './features/hardware/HardwareKpis';
import { NewJoinersStrip } from './features/hardware/NewJoinersStrip';
import { HardwareTableToolbar } from './features/hardware/HardwareTableToolbar';
import { HardwareTable } from './features/hardware/HardwareTable';
import { BulkActionBar } from './features/hardware/BulkActionBar';
import { AssetDetailDrawer } from './features/hardware/AssetDetailDrawer';
import { AddStockModal } from './features/hardware/AddStockModal';
import { AssignDeviceModal } from './features/hardware/AssignDeviceModal';
import { AutoCategorizeModal } from './features/hardware/AutoCategorizeModal';

// Software Features
import { SoftwareKpis } from './features/software/SoftwareKpis';
import { UpcomingRenewalsStrip } from './features/software/UpcomingRenewalsStrip';
import { SavingsOpportunities } from './features/software/SavingsOpportunities';
import { SoftwareToolbar } from './features/software/SoftwareToolbar';
import { SoftwareTable } from './features/software/SoftwareTable';
import { SoftwareInsights } from './features/software/SoftwareInsights';
import { SubscriptionDetailDrawer } from './features/software/SubscriptionDetailDrawer';
import { AddEditSubscriptionModal } from './features/software/AddEditSubscriptionModal';

import { Laptop, Sparkles, BarChart3, Table as TableIcon, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isLoadingTab,
    softwareView,
    setSoftwareView,
    assets,
    subscriptions,
  } = useStore();

  const [hardwareFilteredCount, setHardwareFilteredCount] = useState<number>(251);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const handleScrollToJoiners = () => {
    const el = document.getElementById('joiners-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-200">
      {/* Modern Collapsible Left Sidebar */}
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onScrollToJoiners={handleScrollToJoiners}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Sticky Top Header */}
        <TopBar onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        {/* Dynamic Workspace Banner */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Section Title & View Selectors */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeTab === 'hardware' ? 'Hardware Fleet Operations' : 'SaaS & License Intelligence'}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Synced
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {activeTab === 'hardware'
                  ? 'Real-time IT device inventory, automated new joiner provisioning, and hardware lifecycle'
                  : 'SaaS financial audit, prorated monthly run-rate accounting, and license utilization'}
              </p>
            </div>

            {/* Right: Segmented Switcher & Views */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Module Toggle (Hardware / Software) */}
              <div className="inline-flex p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl shadow-xs">
                <button
                  onClick={() => setActiveTab('hardware')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    activeTab === 'hardware'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Hardware ({assets.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('software')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    activeTab === 'software'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Software ({subscriptions.length})</span>
                </button>
              </div>

              {/* In Software mode: Table vs Insights toggle */}
              {activeTab === 'software' && (
                <div className="inline-flex p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl shadow-xs">
                  <button
                    onClick={() => setSoftwareView('list')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      softwareView === 'list'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Contracts</span>
                  </button>
                  <button
                    onClick={() => setSoftwareView('insights')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      softwareView === 'insights'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Analytics</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tab Content with 400ms Skeleton Transition */}
          {isLoadingTab ? (
            <SkeletonLoader />
          ) : activeTab === 'hardware' ? (
            /* ================= HARDWARE TAB ================= */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Attention AI Banner */}
              <AttentionBanner />

              {/* KPI Cards Row */}
              <HardwareKpis />

              {/* New Joiners Strip */}
              <NewJoinersStrip />

              {/* Table Area */}
              <div>
                <HardwareTableToolbar filteredCount={hardwareFilteredCount} />
                <HardwareTable onFilteredCountChange={setHardwareFilteredCount} />
              </div>

              {/* Bulk Action Bar */}
              <BulkActionBar totalMatching={hardwareFilteredCount} />
            </div>
          ) : (
            /* ================= SOFTWARE TAB ================= */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Software KPIs Row */}
              <SoftwareKpis />

              {/* Upcoming Renewals Strip */}
              <UpcomingRenewalsStrip />

              {/* Savings Opportunities Card */}
              <SavingsOpportunities />

              {/* Software Toolbar */}
              <SoftwareToolbar />

              {/* Software List or Insights View */}
              {softwareView === 'list' ? <SoftwareTable /> : <SoftwareInsights />}
            </div>
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <AssetDetailDrawer />
      <SubscriptionDetailDrawer />
      <AddStockModal />
      <AddEditSubscriptionModal />
      <AssignDeviceModal />
      <AutoCategorizeModal />
      <StockAlertSettingsModal />
      <ReportIssueModal />
      <HelpShortcutsModal />
      <CommandPalette />

      {/* Global Floating Toast & Prototype Reviewer Guide */}
      <ToastContainer />
      <PrototypeGuide />
    </div>
  );
};
