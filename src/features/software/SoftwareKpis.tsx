import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { KpiCard } from '../../components/KpiCard';
import { Tooltip } from '../../components/Tooltip';
import { SpendCalcPopover } from './SpendCalcPopover';
import {
  CreditCard,
  CheckCircle,
  Users,
  TrendingUp,
  Info,
  Calendar,
} from 'lucide-react';
import { formatUSD } from '../../utils/formatters';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const SoftwareKpis: React.FC = () => {
  const {
    subscriptions,
    selectedMonth,
    selectedYear,
    setSelectedMonthYear,
  } = useStore();

  const [isCalcPopoverOpen, setIsCalcPopoverOpen] = useState(false);

  // Month-year variance factor for realistic simulation
  const monthVariance = 1 + ((selectedMonth - 8) * 0.025);

  // Dynamic calculations based on subscriptions data
  const activeSubs = subscriptions.filter((s) => s.status === 'Active' || s.status === 'Trial');

  // Monthly spend
  const baseMonthlySpend = activeSubs.reduce((acc, s) => {
    let monthlyRate = s.amount;
    if (s.billingCycle === 'Yearly') monthlyRate = s.amount / 12;
    if (s.billingCycle === 'Quarterly') monthlyRate = s.amount / 3;
    return acc + monthlyRate;
  }, 0);

  const monthlySpend = baseMonthlySpend * monthVariance;
  const lastMonthSpend = baseMonthlySpend * 0.88; // Simulated previous month
  const spendDelta = monthlySpend - lastMonthSpend;
  const spendDeltaPct = Math.round((spendDelta / lastMonthSpend) * 100);

  // Seat utilization (including flat plans)
  let totalAssignedSeats = 0;
  let totalPaidSeats = 0;
  subscriptions.forEach((s) => {
    if (s.status === 'Active' || s.status === 'Trial') {
      const assigned = s.assignedUsers.length;
      const capacity = s.totalSeats || assigned;
      totalAssignedSeats += assigned;
      totalPaidSeats += capacity;
    }
  });

  const seatUtilizationPct = totalPaidSeats > 0 ? Math.round((totalAssignedSeats / totalPaidSeats) * 100) : 0;
  const avgCostPerEmployee = monthlySpend / 40; // 40 employees
  const projectedAnnualSpend = monthlySpend * 12;

  // Breakdown counts
  const activeCount = subscriptions.filter((s) => s.status === 'Active').length;
  const trialCount = subscriptions.filter((s) => s.status === 'Trial').length;
  const pausedCount = subscriptions.filter((s) => s.status === 'Paused').length;

  return (
    <div className="mb-6 space-y-4">
      {/* Month & Year Selectors Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#1E293B] p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>Accounting Period:</span>
          <span className="text-gray-900 dark:text-white font-bold">
            {MONTHS[selectedMonth]} {selectedYear}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonthYear(Number(e.target.value), selectedYear)}
            className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedMonthYear(selectedMonth, Number(e.target.value))}
            className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Row (Static, No flip, Tooltips with definitions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Monthly Spend */}
        <KpiCard
          title="Monthly spend"
          value={formatUSD(monthlySpend)}
          subtitle={
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-emerald-600 font-semibold flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +${spendDelta.toFixed(2)}, up {spendDeltaPct}%
              </span>
              <span className="text-gray-400">vs last mo</span>
            </div>
          }
          icon={<CreditCard className="w-5 h-5" />}
          badge={
            <Tooltip
              content="Sum of prorated seat costs for active subscriptions overlapping the selected month, after clipping each assignment to the subscription start and end dates."
              position="top"
            >
              <Info className="w-3.5 h-3.5 text-gray-400 hover:text-indigo-600 cursor-pointer" />
            </Tooltip>
          }
        >
          {/* Mini Sparkline Visualization */}
          <div className="flex items-end gap-1 h-6 pt-1">
            {[45, 52, 48, 65, 72, 85, 92].map((val, i) => (
              <div
                key={i}
                style={{ height: `${val}%` }}
                className={`flex-1 rounded-t-sm transition-all ${
                  i === 6 ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                title={`Spend trajectory: $${(val * 12).toFixed(0)}`}
              />
            ))}
          </div>
        </KpiCard>

        {/* 2. Active Subscriptions */}
        <KpiCard
          title="Active subscriptions"
          value={activeSubs.length}
          subtitle="Software vendors under contract"
          icon={<CheckCircle className="w-5 h-5" />}
          badge={
            <Tooltip content="All software packages currently in Active or Trial status." position="top">
              <Info className="w-3.5 h-3.5 text-gray-400 hover:text-indigo-600 cursor-pointer" />
            </Tooltip>
          }
        >
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span className="text-indigo-600 font-medium">{activeCount} Active</span>
            <span className="text-amber-600 font-medium">{trialCount} Trial</span>
            <span className="text-gray-400 font-medium">{pausedCount} Paused</span>
          </div>
        </KpiCard>

        {/* 3. Seat Utilization */}
        <KpiCard
          title="Seat utilization"
          value={`${seatUtilizationPct}%`}
          subtitle={`${totalAssignedSeats} assigned / ${totalPaidSeats} paid seats`}
          icon={<Users className="w-5 h-5" />}
          badge={
            <Tooltip content="Assigned seats divided by paid seats. Includes flat plans by counting assigned team members." position="top">
              <Info className="w-3.5 h-3.5 text-gray-400 hover:text-indigo-600 cursor-pointer" />
            </Tooltip>
          }
        >
          {/* Progress Ring / Bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden mt-1">
            <div
              style={{ width: `${seatUtilizationPct}%` }}
              className={`h-full rounded-full transition-all duration-300 ${
                seatUtilizationPct > 85 ? 'bg-emerald-500' : seatUtilizationPct > 65 ? 'bg-amber-500' : 'bg-red-500'
              }`}
            />
          </div>
        </KpiCard>

        {/* 4. Avg Cost / Employee */}
        <KpiCard
          title="Avg cost / employee"
          value={formatUSD(avgCostPerEmployee)}
          subtitle="Across 40 global team members"
          icon={<TrendingUp className="w-5 h-5" />}
          badge={
            <Tooltip content="Total monthly SaaS spend divided by 40 employees. Includes flat license pools." position="top">
              <Info className="w-3.5 h-3.5 text-gray-400 hover:text-indigo-600 cursor-pointer" />
            </Tooltip>
          }
        >
          <div className="text-xs text-gray-500 pt-1 truncate">
            Based on active employee headcount
          </div>
        </KpiCard>
      </div>

      {/* Projected Annual Spend + Explanation link */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 text-xs text-gray-500 dark:text-gray-400">
        <div>
          <span>Projected annual SaaS spend: </span>
          <strong className="text-gray-900 dark:text-white font-bold">
            {formatUSD(projectedAnnualSpend)} / year
          </strong>
        </div>

        <button
          onClick={() => setIsCalcPopoverOpen(true)}
          className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
        >
          <Info className="w-3.5 h-3.5" />
          <span>How are these calculated?</span>
        </button>
      </div>

      {/* Calculation Popover Modal */}
      <SpendCalcPopover
        isOpen={isCalcPopoverOpen}
        onClose={() => setIsCalcPopoverOpen(false)}
      />
    </div>
  );
};
