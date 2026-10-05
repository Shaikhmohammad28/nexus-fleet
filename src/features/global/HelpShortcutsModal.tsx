import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Modal } from '../../components/Modal';
import { Keyboard, Check } from 'lucide-react';

export const HelpShortcutsModal: React.FC = () => {
  const {
    isHelpOpen,
    setHelpOpen,
    setCommandPaletteOpen,
    isCommandPaletteOpen,
    setAddStockModalOpen,
    activeTab,
    setActiveTab,
    activeDrawerAssetId,
    setActiveDrawerAssetId,
    activeDrawerSubscriptionId,
    setActiveDrawerSubscriptionId,
  } = useStore();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setHelpOpen(!isHelpOpen);
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setActiveTab('hardware');
        setAddStockModalOpen(true);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setActiveTab(activeTab === 'hardware' ? 'software' : 'hardware');
      } else if (e.key === 'Escape') {
        if (isHelpOpen) setHelpOpen(false);
        if (isCommandPaletteOpen) setCommandPaletteOpen(false);
        if (activeDrawerAssetId) setActiveDrawerAssetId(null);
        if (activeDrawerSubscriptionId) setActiveDrawerSubscriptionId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isHelpOpen,
    setHelpOpen,
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setAddStockModalOpen,
    activeTab,
    setActiveTab,
    activeDrawerAssetId,
    setActiveDrawerAssetId,
    activeDrawerSubscriptionId,
    setActiveDrawerSubscriptionId,
  ]);

  const shortcuts = [
    { key: 'Ctrl + /', desc: 'Open Command Palette & Global Search' },
    { key: 'N', desc: 'Quick Add Inventory Stock' },
    { key: 'S', desc: 'Toggle Tab between Hardware & Software' },
    { key: '?', desc: 'Show Keyboard Shortcuts Reference' },
    { key: 'Esc', desc: 'Dismiss Active Modal, Drawer, or Palette' },
  ];

  return (
    <Modal
      isOpen={isHelpOpen}
      onClose={() => setHelpOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Keyboard Shortcuts Reference</span>
        </div>
      }
      subtitle="Speed up IT operations and fleet navigation"
      maxWidth="sm"
      footer={
        <button
          onClick={() => setHelpOpen(false)}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn transition-colors"
        >
          Got it
        </button>
      }
    >
      <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-gray-900/30 text-xs">
        {shortcuts.map((sc) => (
          <div key={sc.key} className="p-3 flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {sc.desc}
            </span>
            <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs">
              {sc.key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
};
