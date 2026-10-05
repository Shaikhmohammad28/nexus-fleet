import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Drawer } from '../../components/Drawer';
import { Chip } from '../../components/Chip';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  ExternalLink,
  Users,
  CreditCard,
  History,
  FileText,
  UserMinus,
  UserPlus,
  Search,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Pause,
  XCircle,
  Pencil,
} from 'lucide-react';
import { formatUSD, formatDisplayDate } from '../../utils/formatters';

export const SubscriptionDetailDrawer: React.FC = () => {
  const {
    activeDrawerSubscriptionId,
    setActiveDrawerSubscriptionId,
    subscriptions,
    employees,
    removeUserFromSubscription,
    addUserToSubscription,
    updateSubscription,
    pauseSubscription,
    cancelSubscription,
    openAddSubscriptionModal,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'billing' | 'activity'>('users');
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [searchNewUserQuery, setSearchNewUserQuery] = useState('');
  const [editableNotes, setEditableNotes] = useState('');
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  if (!activeDrawerSubscriptionId) return null;

  const sub = subscriptions.find((s) => s.id === activeDrawerSubscriptionId);
  if (!sub) return null;

  const assignedUsers = employees.filter((e) => sub.assignedUsers.includes(e.id));
  const filteredAssignedUsers = assignedUsers.filter((u) =>
    u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  const availableEmployees = employees.filter((e) => !sub.assignedUsers.includes(e.id));
  const filteredNewUsers = availableEmployees.filter((u) =>
    u.name.toLowerCase().includes(searchNewUserQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchNewUserQuery.toLowerCase())
  );

  const capacity = sub.totalSeats || sub.assignedUsers.length;
  const used = sub.assignedUsers.length;

  return (
    <>
      <Drawer
        isOpen={Boolean(activeDrawerSubscriptionId)}
        onClose={() => setActiveDrawerSubscriptionId(null)}
        title={sub.name}
        subtitle={`${sub.provider} · ${sub.department}`}
        headerAction={
          <Chip
            variant={
              sub.status === 'Active'
                ? 'emerald'
                : sub.status === 'Trial'
                ? 'amber'
                : sub.status === 'Paused'
                ? 'blue'
                : 'red'
            }
            dot
            size="sm"
          >
            {sub.status}
          </Chip>
        }
        footer={
          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {sub.status !== 'Paused' && (
                <button
                  onClick={() => pauseSubscription(sub.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 border border-gray-200 dark:border-gray-700 rounded-btn transition-colors"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </button>
              )}
              {sub.status !== 'Cancelled' && (
                <button
                  onClick={() => setIsConfirmCancelOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-btn transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel plan</span>
                </button>
              )}
            </div>

            <button
              onClick={() => openAddSubscriptionModal(sub.id)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn shadow-xs transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        }
      >
        {/* Subtabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 pb-2 -mt-2">
          {(['users', 'overview', 'billing', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 text-xs font-medium capitalize border-b-2 -mb-2.5 transition-all ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400'
              }`}
            >
              {tab === 'users' ? `Users (${used}/${capacity})` : tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Users (Live Counter + Remove X + Add Search) */}
        {activeTab === 'users' && (
          <div className="space-y-4 pt-2">
            {/* Live Utilization Summary Card */}
            <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-900 dark:text-indigo-200 font-medium block">
                  Live Seat Allocation
                </span>
                <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                  {used} of {capacity} seats utilized
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {capacity - used > 0
                    ? `${capacity - used} seats available to assign`
                    : '100% capacity reached'}
                </div>
              </div>

              <button
                onClick={() => setIsAddUserOpen(!isAddUserOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn shadow-xs transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add user</span>
              </button>
            </div>

            {/* Add User Dropdown Panel */}
            {isAddUserOpen && (
              <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md space-y-2 animate-in fade-in">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                  Assign Seat License to Employee
                </span>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-400" />
                  <input
                    type="text"
                    value={searchNewUserQuery}
                    onChange={(e) => setSearchNewUserQuery(e.target.value)}
                    placeholder="Search unassigned employee..."
                    className="w-full pl-8 pr-3 py-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
                  />
                </div>
                <div className="max-h-36 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredNewUsers.slice(0, 8).map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => {
                        addUserToSubscription(sub.id, emp.id);
                        setIsAddUserOpen(false);
                        setSearchNewUserQuery('');
                      }}
                      className="p-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                          {emp.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {emp.name}
                          </div>
                          <div className="text-[10px] text-gray-400">{emp.department}</div>
                        </div>
                      </div>
                      <span className="text-indigo-600 font-semibold text-xs">+ Assign</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Assigned Users */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                placeholder="Search assigned members..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Assigned Users List with Remove "X" */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900/30">
              {filteredAssignedUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-xs shrink-0">
                      {user.avatar}
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs text-gray-900 dark:text-white">
                        {user.name}
                      </h5>
                      <div className="text-[11px] text-gray-400">
                        {user.role} · {user.department}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeUserFromSubscription(sub.id, user.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title={`Revoke seat from ${user.name}`}
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/80 dark:border-gray-700 space-y-2">
              <span className="text-gray-400 uppercase text-[10px] font-bold">
                Contract Overview
              </span>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {sub.description}
              </p>
              <div className="pt-1">
                <a
                  href={sub.providerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>{sub.providerUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-gray-400 block text-[10px]">Pricing Model</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {sub.type} ({sub.billingCycle})
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-gray-400 block text-[10px]">Billed Amount</span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {formatUSD(sub.amount)}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-gray-400 block text-[10px]">Contract Owner</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {sub.ownerName}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-gray-400 block text-[10px]">Next Renewal</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Day {sub.renewalDay} ({formatDisplayDate(sub.nextRenewalDate)})
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
              <span className="text-gray-400 block text-[10px]">Internal Admin Notes</span>
              <p className="text-gray-600 dark:text-gray-300">
                {sub.notes || 'No specific notes recorded for this contract.'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Billing History */}
        {activeTab === 'billing' && (
          <div className="space-y-3 pt-2 text-xs">
            <span className="text-gray-500 font-medium">Last 6 Billing Statements</span>
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900/30">
              {sub.billingHistory.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  No invoices generated yet (Current Trial Plan)
                </div>
              ) : (
                sub.billingHistory.map((b) => (
                  <div key={b.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {b.invoiceNumber}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {formatDisplayDate(b.date)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatUSD(b.amount)}
                      </span>
                      <div className="text-emerald-600 font-medium text-[11px] flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Paid</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Activity */}
        {activeTab === 'activity' && (
          <div className="space-y-4 pt-2 text-xs">
            <span className="text-gray-500 font-medium">Subscription Audit Trail</span>
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
              {sub.activity.map((act) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-900" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {act.description}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {formatDisplayDate(act.date)} · By {act.user}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>

      {/* Cancel Subscription Confirmation Dialog */}
      {isConfirmCancelOpen && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setIsConfirmCancelOpen(false)}
          onConfirm={() => {
            cancelSubscription(sub.id);
            setIsConfirmCancelOpen(false);
          }}
          title={`Cancel ${sub.name} subscription?`}
          message={`Are you sure you want to cancel ${sub.name}? Scheduled renewals will cease immediately.`}
          confirmLabel="Confirm Cancellation"
          isDanger={true}
        />
      )}
    </>
  );
};
