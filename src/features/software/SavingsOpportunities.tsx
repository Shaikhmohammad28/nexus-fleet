import React from 'react';
import { useStore } from '../../store/useStore';
import { PiggyBank, ArrowRight, Sparkles } from 'lucide-react';
import { formatUSD } from '../../utils/formatters';

export const SavingsOpportunities: React.FC = () => {
  const { subscriptions, setActiveDrawerSubscriptionId } = useStore();

  // Find seat-based subscriptions with unused seats
  const opportunities = subscriptions
    .filter((s) => s.type === 'Seat based' && s.totalSeats && s.totalSeats > s.assignedUsers.length)
    .map((s) => {
      const unusedSeats = (s.totalSeats || 0) - s.assignedUsers.length;
      const pricePerSeat = s.pricePerSeat || (s.amount / (s.totalSeats || 1));
      const monthlySavings = unusedSeats * pricePerSeat;
      return {
        subId: s.id,
        name: s.name,
        totalSeats: s.totalSeats || 0,
        usedSeats: s.assignedUsers.length,
        unusedSeats,
        monthlySavings,
      };
    })
    .filter((o) => o.monthlySavings > 0);

  const totalPotentialSavings = opportunities.reduce((acc, o) => acc + o.monthlySavings, 0);

  if (opportunities.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-500/10 via-indigo-500/5 to-transparent rounded-2xl border border-emerald-500/20 dark:border-emerald-500/30 p-5 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-sm">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span>SaaS License Optimization Opportunities</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Sparkles className="w-3 h-3" /> Direct Savings
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Recover unused license capacity without impacting active employee workflows.
            </p>
          </div>
        </div>

        <div className="text-right self-end sm:self-center">
          <span className="text-[11px] text-slate-500 uppercase font-semibold tracking-wider block">
            Potential Savings
          </span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatUSD(totalPotentialSavings)} / month
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
        {opportunities.map((item) => (
          <div
            key={item.subId}
            className="p-3.5 bg-white dark:bg-[#111726] rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 shadow-xs flex items-center justify-between gap-3"
          >
            <div>
              <div className="font-semibold text-xs text-slate-900 dark:text-white">
                {item.name}: {item.unusedSeats} of {item.totalSeats} seats unused
              </div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                Save {formatUSD(item.monthlySavings)} / mo
              </div>
            </div>

            <button
              onClick={() => setActiveDrawerSubscriptionId(item.subId)}
              className="h-8 flex items-center gap-1 px-3 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-xl transition-all shrink-0"
            >
              <span>Review seats</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
