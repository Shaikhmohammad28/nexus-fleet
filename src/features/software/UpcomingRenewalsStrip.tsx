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
      <div className="flex items-stretch gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
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
                  : 'bg-gray-50/70 dark:bg-gray-900/40 border-gray-200/80 dark:border-gray-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {sub.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {sub.name}
                      </h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {sub.department} · {sub.billingCycle}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      daysLeft <= 7
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                    }`}
                  >
                    in {daysLeft} days
                  </span>
                </div>

                {/* Amount and Auto-renew status */}
                <div className="flex items-center justify-between py-2 border-t border-b border-gray-200/60 dark:border-gray-800/80 my-2 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Renewal Amount</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      {formatUSD(sub.amount)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px]">Auto-Renew</span>
                    {sub.autoRenew ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Manual
                      </span>
                    )}
                  </div>
                </div>

                {/* Next Renewal Date */}
                <div className="text-xs text-gray-500 mb-3 flex items-center justify-between">
                  <span>Renewal Date:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
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
              <div className="flex items-center gap-2 pt-1">
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
                      className="flex-1 py-1.5 px-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn transition-colors text-center"
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
                      className="py-1.5 px-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-btn transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {!sub.autoRenew && (
                      <button
                        onClick={() => renewSubscriptionNow(sub.id)}
                        className="flex-1 py-1.5 px-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn transition-colors text-center flex items-center justify-center gap-1"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Renew now</span>
                      </button>
                    )}
                    <button
                      onClick={() => remindSubscription(sub.id)}
                      className="py-1.5 px-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-btn transition-colors flex items-center gap-1"
                      title="Set reminder alert"
                    >
                      <BellRing className="w-3.5 h-3.5 text-gray-500" />
                      <span>Remind me</span>
                    </button>
                    <button
                      onClick={() => setActiveDrawerSubscriptionId(sub.id)}
                      className="py-1.5 px-2.5 text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
