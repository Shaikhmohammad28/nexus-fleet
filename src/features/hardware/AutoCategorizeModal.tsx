import React from 'react';
import { useStore } from '../../store/useStore';
import { Modal } from '../../components/Modal';
import { Sparkles, Check, Laptop, Monitor as MonitorIcon, Cpu } from 'lucide-react';
import { Chip } from '../../components/Chip';

export const AutoCategorizeModal: React.FC = () => {
  const {
    isAutoCategorizeModalOpen,
    setAutoCategorizeModalOpen,
    autoCategorizeAssets,
    assets,
  } = useStore();

  const uncategorized = assets.filter((a) => a.family === 'Other');

  // Preview rule statistics
  const macMatches = uncategorized.filter((a) => {
    const t = a.title.toLowerCase();
    return t.includes('macbook') || t.includes('apple') || t.includes('mac');
  }).length;

  const winMatches = uncategorized.filter((a) => {
    const t = a.title.toLowerCase();
    return (
      t.includes('dell') ||
      t.includes('lenovo') ||
      t.includes('thinkpad') ||
      t.includes('latitude') ||
      t.includes('xps') ||
      t.includes('precision')
    );
  }).length;

  const monMatches = uncategorized.filter((a) => {
    const t = a.title.toLowerCase();
    return (
      t.includes('monitor') ||
      t.includes('ultrafine') ||
      t.includes('ultrasharp') ||
      t.includes('display')
    );
  }).length;

  const totalMatches = macMatches + winMatches + monMatches;

  const handleApply = () => {
    autoCategorizeAssets();
    setAutoCategorizeModalOpen(false);
  };

  return (
    <Modal
      isOpen={isAutoCategorizeModalOpen}
      onClose={() => setAutoCategorizeModalOpen(false)}
      title={
        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Auto-Categorize Hardware Assets</span>
        </div>
      }
      subtitle="Preview heuristic keyword classification based on hardware titles"
      maxWidth="lg"
      footer={
        <>
          <button
            onClick={() => setAutoCategorizeModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-btn transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-btn shadow-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply to {totalMatches} assets</span>
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          The following deterministic rules will be applied to assign product families to all currently uncategorized inventory assets:
        </p>

        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900/40">
          {/* Mac rule */}
          <div className="p-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                  Keyword pattern: "MacBook*", "Apple", "Mac"
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Target Family:{' '}
                  <Chip variant="indigo" size="sm">
                    Mac
                  </Chip>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-gray-900 dark:text-white">
                {macMatches}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                assets
              </span>
            </div>
          </div>

          {/* Windows rule */}
          <div className="p-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                  Keyword pattern: "Dell", "Lenovo", "ThinkPad", "Latitude"
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Target Family:{' '}
                  <Chip variant="blue" size="sm">
                    Windows
                  </Chip>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-gray-900 dark:text-white">
                {winMatches}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                assets
              </span>
            </div>
          </div>

          {/* Monitor rule */}
          <div className="p-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <MonitorIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                  Keyword pattern: "Monitor", "UltraFine", "Display"
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Target Family:{' '}
                  <Chip variant="purple" size="sm">
                    Monitor
                  </Chip>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-gray-900 dark:text-white">
                {monMatches}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                assets
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 rounded-xl text-xs text-indigo-800 dark:text-indigo-300 flex items-center justify-between">
          <span>Total categorized upon confirmation:</span>
          <span className="font-semibold text-sm">
            {totalMatches} of {uncategorized.length} assets (100%)
          </span>
        </div>
      </div>
    </Modal>
  );
};
