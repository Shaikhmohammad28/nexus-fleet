import React from 'react';
import { useStore } from '../../store/useStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatUSD } from '../../utils/formatters';
import { ExternalLink, TrendingUp, Sparkles } from 'lucide-react';

const DONUT_COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6', '#64748B'];

export const SoftwareInsights: React.FC = () => {
  const { subscriptions, setActiveDrawerSubscriptionId } = useStore();

  // 6-month historical spend data
  const historicalSpend = [
    { month: 'Apr', spend: 890 },
    { month: 'May', spend: 940 },
    { month: 'Jun', spend: 980 },
    { month: 'Jul', spend: 1040 },
    { month: 'Aug', spend: 1120 },
    { month: 'Sep', spend: 1212.87 },
  ];

  // Donut chart distribution by subscription
  const donutData = subscriptions
    .filter((s) => s.status === 'Active' || s.status === 'Trial')
    .map((s) => {
      let monthly = s.amount;
      if (s.billingCycle === 'Yearly') monthly = s.amount / 12;
      if (s.billingCycle === 'Quarterly') monthly = s.amount / 3;
      return {
        id: s.id,
        name: s.name,
        value: Number(monthly.toFixed(2)),
      };
    })
    .sort((a, b) => b.value - a.value);

  // Top 5 costliest subscriptions
  const topCostliest = [...donutData].slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. 6-Month Spend Trend Bar Chart */}
        <div className="bg-white dark:bg-[#111726] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Monthly SaaS Spend Trend (Last 6 Months)</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +36%
                </span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prorated software expenditure trajectory across all departments
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalSpend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.4} />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(v) => `$${v}`} />
                <RechartsTooltip
                  formatter={(val: number) => [`$${val.toFixed(2)} USD`, 'Spend']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: '1px solid #1E293B',
                  }}
                />
                <Bar dataKey="spend" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Donut Chart by Subscription (Click slice to open drawer!) */}
        <div className="bg-white dark:bg-[#111726] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Spend Share by Software Platform
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive distribution (Click any slice to inspect subscription drawer)
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  onClick={(entry) => {
                    if (entry && entry.id) {
                      setActiveDrawerSubscriptionId(entry.id);
                    }
                  }}
                  cursor="pointer"
                >
                  {donutData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(val: number, name: string) => [`$${val.toFixed(2)} / mo`, name]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: '1px solid #1E293B',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 5 Costliest Platforms List */}
      <div className="bg-white dark:bg-[#111726] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Top 5 Costliest SaaS Platforms
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Ranked by normalized monthly expenditure run-rate
        </p>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
          {topCostliest.map((item, idx) => {
            const sub = subscriptions.find((s) => s.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => setActiveDrawerSubscriptionId(item.id)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{item.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {sub?.provider} · {sub?.assignedUsers.length || 0} active users
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                    {formatUSD(item.value)} / mo
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {formatUSD(item.value * 12)} / yr run-rate
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
