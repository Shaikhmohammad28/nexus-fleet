import React from 'react';
import { useStore } from '../../store/useStore';
import {
  Search,
  Plus,
  Download,
  List,
  BarChart3,
  X,
} from 'lucide-react';
import { downloadCsv, formatUSD, formatDisplayDate } from '../../utils/formatters';

export const SoftwareToolbar: React.FC = () => {
  const {
    subscriptions,
    softwareView,
    setSoftwareView,
    softwareSearchQuery,
    setSoftwareSearchQuery,
    softwareFilterStatus,
    setSoftwareFilterStatus,
    softwareFilterType,
    setSoftwareFilterType,
    clearSoftwareFilters,
    openAddSubscriptionModal,
    addToast,
  } = useStore();

  const statusCounts = {
    All: subscriptions.length,
    Active: subscriptions.filter((s) => s.status === 'Active').length,
    Trial: subscriptions.filter((s) => s.status === 'Trial').length,
    Paused: subscriptions.filter((s) => s.status === 'Paused').length,
    Expired: subscriptions.filter((s) => s.status === 'Expired').length,
    Cancelled: subscriptions.filter((s) => s.status === 'Cancelled').length,
  };

  const handleExportCsv = () => {
    const headers = [
      'Subscription Name',
      'Provider',
      'Status',
      'Type',
      'Amount (USD)',
      'Billing Cycle',
      'Seats Used',
      'Total Seats',
      'Auto Renew',
      'Next Renewal',
      'Owner',
    ];

    const rows = subscriptions.map((s) => [
      s.name,
      s.provider,
      s.status,
      s.type,
      formatUSD(s.amount),
      s.billingCycle,
      s.assignedUsers.length,
      s.totalSeats || s.assignedUsers.length,
      s.autoRenew ? 'Yes' : 'No',
      formatDisplayDate(s.nextRenewalDate),
      s.ownerName,
    ]);

    downloadCsv(`software_subscriptions_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    addToast({
      title: 'Exported Subscriptions CSV',
      message: `${subscriptions.length} subscription records exported.`,
      type: 'success',
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
      {/* Left: Search & Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
        {/* Search */}
        <div className="relative min-w-[220px] max-w-xs flex-1 h-9">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={softwareSearchQuery}
            onChange={(e) => setSoftwareSearchQuery(e.target.value)}
            placeholder="Search platform, provider, owner..."
            className="w-full h-9 pl-9 pr-8 text-xs bg-white dark:bg-[#111726] border border-slate-200/90 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 shadow-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
          />
          {softwareSearchQuery && (
            <button
              onClick={() => setSoftwareSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown with counts */}
        <select
          value={softwareFilterStatus}
          onChange={(e) => setSoftwareFilterStatus(e.target.value)}
          className="h-9 px-3 text-xs font-medium bg-white dark:bg-[#111726] border border-slate-200/90 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer"
        >
          <option value="All">All statuses ({statusCounts.All})</option>
          <option value="Active">Active ({statusCounts.Active})</option>
          <option value="Trial">Trial ({statusCounts.Trial})</option>
          <option value="Paused">Paused ({statusCounts.Paused})</option>
          <option value="Expired">Expired ({statusCounts.Expired})</option>
          <option value="Cancelled">Cancelled ({statusCounts.Cancelled})</option>
        </select>

        {/* Type Dropdown */}
        <select
          value={softwareFilterType}
          onChange={(e) => setSoftwareFilterType(e.target.value)}
          className="h-9 px-3 text-xs font-medium bg-white dark:bg-[#111726] border border-slate-200/90 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer"
        >
          <option value="All">All billing types</option>
          <option value="Flat">Flat</option>
          <option value="Seat based">Seat based</option>
        </select>
      </div>

      {/* Right: View Toggle, CSV Export, Add Subscription */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {/* List | Insights Toggle */}
        <div className="h-9 flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setSoftwareView('list')}
            className={`h-full flex items-center gap-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
              softwareView === 'list'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            onClick={() => setSoftwareView('insights')}
            className={`h-full flex items-center gap-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
              softwareView === 'insights'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Insights</span>
          </button>
        </div>

        {/* Export CSV */}
        <button
          onClick={handleExportCsv}
          className="h-9 flex items-center gap-1.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111726] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 rounded-xl transition-all shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export CSV</span>
        </button>

        {/* + Add Subscription */}
        <button
          onClick={() => openAddSubscriptionModal()}
          className="h-9 flex items-center gap-1.5 px-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all focus:ring-2 focus:ring-indigo-500"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Subscription</span>
        </button>
      </div>
    </div>
  );
};
