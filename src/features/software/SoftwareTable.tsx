import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { SoftwareSubscription, SubscriptionStatus } from '../../types';
import { Chip } from '../../components/Chip';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  ExternalLink,
  Eye,
  Pencil,
  MoreVertical,
  ChevronDown,
  ArrowUpDown,
  Laptop,
} from 'lucide-react';
import { formatUSD, formatDisplayDate } from '../../utils/formatters';

export const SoftwareTable: React.FC = () => {
  const {
    subscriptions,
    employees,
    softwareSearchQuery,
    softwareFilterStatus,
    softwareFilterType,
    clearSoftwareFilters,
    updateSubscriptionStatus,
    toggleSubscriptionAutoRenew,
    deleteSubscription,
    pauseSubscription,
    cancelSubscription,
    setActiveDrawerSubscriptionId,
    openAddSubscriptionModal,
    addToast,
  } = useStore();

  const [sortField, setSortField] = useState<keyof SoftwareSubscription>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeKebabId, setActiveKebabId] = useState<string | null>(null);
  const [statusDropdownSubId, setStatusDropdownSubId] = useState<string | null>(null);
  const [deleteConfirmSub, setDeleteConfirmSub] = useState<SoftwareSubscription | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter
  const filteredSubs = useMemo(() => {
    return subscriptions.filter((s) => {
      if (softwareSearchQuery.trim()) {
        const q = softwareSearchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesProvider = s.provider.toLowerCase().includes(q);
        const matchesOwner = s.ownerName.toLowerCase().includes(q);
        if (!matchesName && !matchesProvider && !matchesOwner) return false;
      }

      if (softwareFilterStatus !== 'All' && s.status !== softwareFilterStatus) {
        return false;
      }

      if (softwareFilterType !== 'All' && s.type !== softwareFilterType) {
        return false;
      }

      return true;
    });
  }, [subscriptions, softwareSearchQuery, softwareFilterStatus, softwareFilterType]);

  // Sort
  const sortedSubs = useMemo(() => {
    return [...filteredSubs].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';

      if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }

      const comp = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? comp : -comp;
    });
  }, [filteredSubs, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedSubs.length / pageSize));
  const paginatedSubs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedSubs.slice(start, start + pageSize);
  }, [sortedSubs, currentPage]);

  const toggleSort = (field: keyof SoftwareSubscription) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-card border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto min-h-[350px]">
        <table className="w-full text-left border-collapse min-w-[1050px]">
          <thead className="sticky top-0 z-20 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th
                onClick={() => toggleSort('name')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 select-none align-middle"
              >
                <div className="flex items-center gap-1.5">
                  <span>Subscription Title & Provider</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th className="py-3.5 px-4 select-none align-middle">
                <span>Assigned Users & Utilization</span>
              </th>

              <th
                onClick={() => toggleSort('type')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 select-none align-middle"
              >
                <div className="flex items-center gap-1.5">
                  <span>Type</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th
                onClick={() => toggleSort('amount')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 select-none align-middle"
              >
                <div className="flex items-center gap-1.5">
                  <span>Amount & Billing Cycle</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th
                onClick={() => toggleSort('nextRenewalDate')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 select-none align-middle"
              >
                <div className="flex items-center gap-1.5">
                  <span>Renewal & Auto-Renew</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th className="py-3.5 px-4 text-center align-middle">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
            {filteredSubs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 px-4 align-middle">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <Laptop className="w-8 h-8 text-indigo-600 mb-2" />
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                      No subscriptions found
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      No software contracts match the selected status or keyword filters.
                    </p>
                    <button
                      onClick={clearSoftwareFilters}
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn"
                    >
                      Clear filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedSubs.map((sub) => {
                const assignedCount = sub.assignedUsers.length;
                const capacity = sub.totalSeats || assignedCount;
                const utilRatio = capacity > 0 ? assignedCount / capacity : 1;
                const utilPct = Math.round(utilRatio * 100);

                // Yearly equivalent
                let annualEquivalent = sub.amount * 12;
                if (sub.billingCycle === 'Yearly') annualEquivalent = sub.amount;
                if (sub.billingCycle === 'Quarterly') annualEquivalent = sub.amount * 4;

                // Status chip color
                const statusVariants: Record<SubscriptionStatus, 'emerald' | 'amber' | 'blue' | 'gray' | 'red'> = {
                  Active: 'emerald',
                  Trial: 'amber',
                  Paused: 'blue',
                  Expired: 'gray',
                  Cancelled: 'red',
                };

                return (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors align-middle"
                  >
                    {/* Title & Provider */}
                    <td className="py-3 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {sub.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">
                              {sub.name}
                            </span>

                            {/* Inline Status Dropdown */}
                            <div className="relative inline-block">
                              <button
                                onClick={() =>
                                  setStatusDropdownSubId(
                                    statusDropdownSubId === sub.id ? null : sub.id
                                  )
                                }
                                className="inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Chip variant={statusVariants[sub.status]} dot size="sm">
                                  <span>{sub.status}</span>
                                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
                                </Chip>
                              </button>

                              {statusDropdownSubId === sub.id && (
                                <div className="absolute left-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-30 animate-in fade-in">
                                  {(['Active', 'Trial', 'Paused', 'Expired', 'Cancelled'] as SubscriptionStatus[]).map(
                                    (st) => (
                                      <button
                                        key={st}
                                        onClick={() => {
                                          updateSubscriptionStatus(sub.id, st);
                                          setStatusDropdownSubId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                      >
                                        {st}
                                      </button>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                            <span>{sub.provider}</span>
                            <span>·</span>
                            <a
                              href={sub.providerUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 hover:underline flex items-center gap-0.5"
                            >
                              <span>Website</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Users & Utilization Bar */}
                    <td className="py-3 px-4">
                      <div className="space-y-1.5 max-w-[200px]">
                        <div className="flex items-center justify-between text-xs">
                          {/* Avatar stack */}
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {sub.assignedUsers.slice(0, 4).map((empId, i) => {
                              const emp = employees.find((e) => e.id === empId);
                              return (
                                <div
                                  key={i}
                                  title={emp?.name || 'User'}
                                  className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-white dark:border-gray-800 text-white flex items-center justify-center text-[10px] font-medium"
                                >
                                  {emp?.avatar || 'U'}
                                </div>
                              );
                            })}
                            {sub.assignedUsers.length > 4 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center text-[9px] font-semibold">
                                +{sub.assignedUsers.length - 4}
                              </div>
                            )}
                          </div>

                          <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                            {assignedCount} / {capacity} seats
                          </span>
                        </div>

                        {/* Utilization Bar */}
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${utilPct}%` }}
                            className={`h-full rounded-full transition-all duration-300 ${
                              utilPct > 85 ? 'bg-emerald-500' : utilPct > 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Type Chip */}
                    <td className="py-3 px-4">
                      <Chip variant={sub.type === 'Seat based' ? 'blue' : 'purple'} size="sm">
                        {sub.type}
                      </Chip>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white text-sm">
                          <span>{formatUSD(sub.amount)}</span>
                          <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            {sub.billingCycle}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {formatUSD(annualEquivalent)}/yr equivalent
                        </div>
                      </div>
                    </td>

                    {/* Renewal & Inline Auto-Renew Toggle */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          Day {sub.renewalDay} ({formatDisplayDate(sub.nextRenewalDate)})
                        </div>

                        {/* Inline Auto-Renew Switch */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={sub.autoRenew}
                            onClick={() => toggleSubscriptionAutoRenew(sub.id)}
                            className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              sub.autoRenew ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                sub.autoRenew ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <span className="text-[11px] text-gray-500">
                            {sub.autoRenew ? 'Auto-renew on' : 'Manual renewal'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Eye opens drawer */}
                        <button
                          onClick={() => setActiveDrawerSubscriptionId(sub.id)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="View Subscription Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Pencil opens Edit Modal */}
                        <button
                          onClick={() => openAddSubscriptionModal(sub.id)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="Edit Subscription"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Kebab Menu */}
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setActiveKebabId(activeKebabId === sub.id ? null : sub.id)
                            }
                            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeKebabId === sub.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-30 animate-in fade-in text-xs text-gray-700 dark:text-gray-200 divide-y divide-gray-100 dark:divide-gray-700/60">
                              <div className="py-1">
                                {sub.status !== 'Paused' && (
                                  <button
                                    onClick={() => {
                                      pauseSubscription(sub.id);
                                      setActiveKebabId(null);
                                    }}
                                    className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
                                  >
                                    Pause subscription
                                  </button>
                                )}
                                {sub.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => {
                                      cancelSubscription(sub.id);
                                      setActiveKebabId(null);
                                    }}
                                    className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
                                  >
                                    Cancel subscription
                                  </button>
                                )}
                              </div>
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    setDeleteConfirmSub(sub);
                                    setActiveKebabId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredSubs.length > 0 && (
        <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50 dark:bg-gray-900/30">
          <span>
            Showing {Math.min((currentPage - 1) * pageSize + 1, filteredSubs.length)}-
            {Math.min(currentPage * pageSize, filteredSubs.length)} of {filteredSubs.length} subscriptions
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmSub && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteConfirmSub(null)}
          onConfirm={() => {
            deleteSubscription(deleteConfirmSub.id);
            setDeleteConfirmSub(null);
          }}
          title={`Delete ${deleteConfirmSub.name}?`}
          message={`Are you sure you want to delete ${deleteConfirmSub.name}? All seat assignments and payment tracking will be permanently removed.`}
          confirmLabel="Delete Subscription"
          isDanger={true}
        />
      )}
    </div>
  );
};
