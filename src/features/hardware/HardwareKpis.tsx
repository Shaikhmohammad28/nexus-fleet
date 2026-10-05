import React from 'react';
import { useStore } from '../../store/useStore';
import { KpiCard } from '../../components/KpiCard';
import { Users, Package, Layers, ShieldAlert, AlertCircle } from 'lucide-react';
import { getWarrantyStatus } from '../../utils/formatters';

export const HardwareKpis: React.FC = () => {
  const {
    assets,
    activeKpiFilter,
    setActiveKpiFilter,
    stockThresholds,
  } = useStore();

  const total = assets.length;
  const assigned = assets.filter((a) => a.status === 'Assigned').length;
  const unassigned = assets.filter((a) => a.status === 'Available').length;

  // Family counts
  const macCount = assets.filter((a) => a.family === 'Mac').length;
  const winCount = assets.filter((a) => a.family === 'Windows').length;
  const monCount = assets.filter((a) => a.family === 'Monitor').length;
  const otherCount = assets.filter((a) => a.family === 'Other').length;

  // Available per family for low stock calculation
  const macAvail = assets.filter((a) => a.family === 'Mac' && a.status === 'Available').length;
  const winAvail = assets.filter((a) => a.family === 'Windows' && a.status === 'Available').length;
  const monAvail = assets.filter((a) => a.family === 'Monitor' && a.status === 'Available').length;

  // Low stock check
  const lowStockItems: { family: 'Mac' | 'Windows' | 'Monitor'; count: number }[] = [];
  if (macAvail <= (stockThresholds.Mac ?? 3)) lowStockItems.push({ family: 'Mac', count: macAvail });
  if (winAvail <= (stockThresholds.Windows ?? 3)) lowStockItems.push({ family: 'Windows', count: winAvail });
  if (monAvail <= (stockThresholds.Monitor ?? 3) && monCount > 0) lowStockItems.push({ family: 'Monitor', count: monAvail });

  // Warranty expiring in 30 days
  const warrantyExpiring30 = assets.filter((a) => {
    const status = getWarrantyStatus(a.warrantyEnd);
    return status.isExpiring30;
  }).length;

  // Distribution percentages
  const macPct = total > 0 ? (macCount / total) * 100 : 0;
  const winPct = total > 0 ? (winCount / total) * 100 : 0;
  const monPct = total > 0 ? (monCount / total) * 100 : 0;
  const otherPct = total > 0 ? (otherCount / total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Assigned Inventory */}
      <KpiCard
        title="Assigned Inventory"
        value={assigned}
        subtitle={`${Math.round((assigned / (total || 1)) * 100)}% of total hardware fleet`}
        icon={<Users className="w-5 h-5" />}
        active={activeKpiFilter === 'assigned'}
        onClick={() => setActiveKpiFilter('assigned')}
      />

      {/* 2. Unassigned Inventory + Low stock alert */}
      <KpiCard
        title="Unassigned Inventory"
        value={unassigned}
        subtitle="Ready for onboarding deployment"
        icon={<Package className="w-5 h-5" />}
        active={activeKpiFilter === 'unassigned'}
        onClick={() => setActiveKpiFilter('unassigned')}
      >
        {lowStockItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {lowStockItems.map((item) => (
              <button
                key={item.family}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveKpiFilter(`low-stock-${item.family}`);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${
                  activeKpiFilter === `low-stock-${item.family}`
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/60 hover:bg-rose-100'
                }`}
              >
                <AlertCircle className="w-3 h-3 text-rose-500 animate-pulse" />
                <span>
                  Low stock: {item.family} ({item.count} left)
                </span>
              </button>
            ))}
          </div>
        )}
      </KpiCard>

      {/* 3. Product Family Distribution */}
      <KpiCard
        title="Product Family Distribution"
        value={total}
        subtitle="Total tracked hardware fleet"
        icon={<Layers className="w-5 h-5" />}
        active={activeKpiFilter?.startsWith('family-') ?? false}
      >
        <div className="space-y-2.5">
          {/* Stacked bar */}
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            {macPct > 0 && (
              <div
                style={{ width: `${macPct}%` }}
                className="bg-indigo-500 transition-all duration-300"
                title={`Mac: ${macCount} (${Math.round(macPct)}%)`}
              />
            )}
            {winPct > 0 && (
              <div
                style={{ width: `${winPct}%` }}
                className="bg-sky-500 transition-all duration-300"
                title={`Windows: ${winCount} (${Math.round(winPct)}%)`}
              />
            )}
            {monPct > 0 && (
              <div
                style={{ width: `${monPct}%` }}
                className="bg-purple-500 transition-all duration-300"
                title={`Monitor: ${monCount} (${Math.round(monPct)}%)`}
              />
            )}
            {otherPct > 0 && (
              <div
                style={{ width: `${otherPct}%` }}
                className="bg-amber-400 transition-all duration-300"
                title={`Other: ${otherCount} (${Math.round(otherPct)}%)`}
              />
            )}
          </div>

          {/* Interactive filter chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveKpiFilter('family-Mac');
              }}
              className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold transition-all ${
                activeKpiFilter === 'family-Mac'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
              }`}
            >
              Mac {macCount}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveKpiFilter('family-Windows');
              }}
              className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold transition-all ${
                activeKpiFilter === 'family-Windows'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-100'
              }`}
            >
              Win {winCount}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveKpiFilter('family-Monitor');
              }}
              className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold transition-all ${
                activeKpiFilter === 'family-Monitor'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100'
              }`}
            >
              Mon {monCount}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveKpiFilter('family-Other');
              }}
              className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold transition-all ${
                activeKpiFilter === 'family-Other'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              Other {otherCount}
            </button>
          </div>
        </div>
      </KpiCard>

      {/* 4. Warranty expiring in 30 days */}
      <KpiCard
        title="Warranty Expiring in 30 Days"
        value={warrantyExpiring30}
        subtitle="Assets requiring immediate coverage triage"
        icon={<ShieldAlert className="w-5 h-5" />}
        active={activeKpiFilter === 'warranty'}
        onClick={() => setActiveKpiFilter('warranty')}
      />
    </div>
  );
};
