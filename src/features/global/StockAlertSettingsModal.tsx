import React from 'react';
import { useStore } from '../../store/useStore';
import { Modal } from '../../components/Modal';
import { ProductFamily } from '../../types';
import { Sliders, Check, Plus, Minus } from 'lucide-react';

export const StockAlertSettingsModal: React.FC = () => {
  const {
    isStockAlertSettingsOpen,
    setStockAlertSettingsOpen,
    stockThresholds,
    setStockThreshold,
  } = useStore();

  const families: ProductFamily[] = ['Mac', 'Windows', 'Monitor'];

  return (
    <Modal
      isOpen={isStockAlertSettingsOpen}
      onClose={() => setStockAlertSettingsOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Low-Stock Alert Thresholds</span>
        </div>
      }
      subtitle="Adjust reorder notification trigger levels per hardware family"
      maxWidth="sm"
      footer={
        <button
          onClick={() => setStockAlertSettingsOpen(false)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn transition-colors shadow-xs"
        >
          <Check className="w-4 h-4" />
          <span>Save Thresholds</span>
        </button>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-gray-500 leading-relaxed">
          When available unassigned stock falls at or below this threshold, a prominent red alert chip appears in the Unassigned KPI card.
        </p>

        <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-gray-900/30">
          {families.map((fam) => {
            const current = stockThresholds[fam] ?? 3;
            return (
              <div key={fam} className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white block">
                    {fam} Family
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Triggers when &le; {current} units left
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStockThreshold(fam, Math.max(1, current - 1))}
                    className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-8 text-center font-bold text-sm text-gray-900 dark:text-white font-mono">
                    {current}
                  </span>

                  <button
                    type="button"
                    onClick={() => setStockThreshold(fam, current + 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
