import React from 'react';
import { useStore } from '../../store/useStore';
import { Chip } from '../../components/Chip';
import { Calendar, BellRing, RotateCw, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatUSD, formatDisplayDate } from '../../utils/formatters';
import { differenceInDays, parseISO } from 'date-fns';

export const UpcomingRenewalsStrip: React.FC = () => {
  const {
    subscriptions,
    setActiveDrawerSubscriptionId,
    renewSubscriptionNow,
    remindSubscription,
    updateSubscriptionStatus,
    addToast,
  } = useStore();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Subscriptions renewing within 30 days or in trial
  const upcoming = subscriptions.filter((s) => {
    if (s.status === 'Cancelled' || s.status === 'Paused') return false;
    try {
      const renew = parseISO(s.nextRenewalDate);
      const diff = differenceInDays(renew, today);
      return diff >= 0 && diff <= 30;
    } catch {
      return false;
    }
  });

  if (upcoming.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-card border border-gray-200 dark:border-gray-800 p-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Upcoming renewals (next 30 days)
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Proactive contract cycles, reminders, and auto-renew safety checks
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
          {upcoming.length} Upcoming
        </span>
      </div>

      {/* Horizontal Cards Carousel */}
      <div className="flex items-stretch gap-4 overflow-x-auto pt-2 pb-5 px-1 scrollbar-thin">
        {upcoming.map((sub) => {
          const renew = parseISO(sub.nextRenewalDate);
          const daysLeft = Math.max(0, differenceInDays(renew, today));
          const isTrial = sub.status === 'Trial';

          return (
            <div
              key={sub.id}
              className={`min-w-[320px] max-w-[320px] p-4 rounded-xl border flex flex-col justify-between self-stretch transition-all duration-200 hover:shadow-sm ${
                isTrial
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                  : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {sub.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {sub.name}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {sub.department} · {sub.billingCycle}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${
                      daysLeft <= 7
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    in {daysLeft} days
                  </span>
                </div>

                {/* Amount and Auto-renew status */}
                <div className="flex items-center justify-between py-2 border-t border-b border-slate-200/60 dark:border-slate-800/80 my-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">Renewal Amount</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {formatUSD(sub.amount)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">Auto-Renew</span>
                    {sub.autoRenew ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Manual
                      </span>
                    )}
                  </div>
                </div>

                {/* Next Renewal Date */}
                <div className="text-xs text-slate-500 mb-3 flex items-center justify-between">
                  <span>Renewal Date:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDisplayDate(sub.nextRenewalDate)}
                  </span>
                </div>

                {/* Trial alert if applicable */}
                {isTrial && (
                  <div className="mb-3 p-2 bg-amber-100/70 dark:bg-amber-900/40 rounded-lg text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
                    <span>Trial ending soon</span>
                    <span className="font-bold">{sub.trialEndsInDays || 5} days left</span>
                  </div>
                )}
              </div>

              {/* Card Action Buttons */}
              <div className="flex items-center gap-2 pt-1 mt-auto">
                {isTrial ? (
                  <>
                    <button
                      onClick={() => {
                        updateSubscriptionStatus(sub.id, 'Active');
                        addToast({
                          title: `${sub.name} converted to Paid`,
                          message: 'Full enterprise plan active.',
                          type: 'success',
                        });
                      }}
                      className="h-9 flex-1 px-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all flex items-center justify-center text-center shadow-xs"
                    >
                      Convert to paid
                    </button>
                    <button
                      onClick={() => {
                        updateSubscriptionStatus(sub.id, 'Cancelled');
                        addToast({
                          title: `${sub.name} trial cancelled`,
                          type: 'info',
                        });
                      }}
                      className="h-9 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {!sub.autoRenew && (
                      <button
                        onClick={() => renewSubscriptionNow(sub.id)}
                        className="h-9 flex-1 px-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all flex items-center justify-center gap-1 text-center shadow-xs"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Renew now</span>
                      </button>
                    )}
                    <button
                      onClick={() => remindSubscription(sub.id)}
                      className="h-9 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                      title="Set reminder alert"
                    >
                      <BellRing className="w-3.5 h-3.5 text-slate-500" />
                      <span>Remind me</span>
                    </button>
                    <button
                      onClick={() => setActiveDrawerSubscriptionId(sub.id)}
                      className="h-9 px-3 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
