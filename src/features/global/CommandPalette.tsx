import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import {
  Search,
  Laptop,
  Users,
  CreditCard,
  Plus,
  Sparkles,
  ArrowRight,
  Command,
} from 'lucide-react';
import { formatUSD } from '../../utils/formatters';

interface PaletteItem {
  id: string;
  type: 'asset' | 'employee' | 'subscription' | 'action';
  title: string;
  subtitle: string;
  payload?: any;
  action?: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    assets,
    employees,
    subscriptions,
    setActiveDrawerAssetId,
    setActiveDrawerSubscriptionId,
    setAddStockModalOpen,
    openAddSubscriptionModal,
    setAutoCategorizeModalOpen,
    setActiveTab,
    addToast,
  } = useStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard listener for Ctrl+/ or Cmd+/ and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Build items list
  let items: PaletteItem[] = [];

  if (!query.trim()) {
    // Quick Actions & Recent
    items = [
      {
        id: 'action-add-stock',
        type: 'action',
        title: 'Add Inventory Stock',
        subtitle: 'Provision new hardware assets into catalog',
        action: () => {
          setActiveTab('hardware');
          setAddStockModalOpen(true);
        },
      },
      {
        id: 'action-add-sub',
        type: 'action',
        title: 'Add Software Subscription',
        subtitle: 'Configure new vendor contract or seat tier',
        action: () => {
          setActiveTab('software');
          openAddSubscriptionModal();
        },
      },
      {
        id: 'action-auto-cat',
        type: 'action',
        title: 'Auto-categorize hardware assets',
        subtitle: 'Run heuristic title classification for uncategorized assets',
        action: () => {
          setActiveTab('hardware');
          setAutoCategorizeModalOpen(true);
        },
      },
      // Recent items
      {
        id: 'recent-1',
        type: 'subscription',
        title: 'Figma',
        subtitle: 'Design · $10.00 / month · 21 assigned users',
        action: () => {
          setActiveTab('software');
          const sub = subscriptions.find((s) => s.name === 'Figma');
          if (sub) setActiveDrawerSubscriptionId(sub.id);
        },
      },
      {
        id: 'recent-2',
        type: 'asset',
        title: 'NEX-MAC-35',
        subtitle: 'MacBook Pro 13" · Assigned to Laxman Meena',
        action: () => {
          setActiveTab('hardware');
          const a = assets.find((ast) => ast.tag === 'NEX-MAC-35');
          if (a) setActiveDrawerAssetId(a.id);
        },
      },
      {
        id: 'recent-3',
        type: 'employee',
        title: 'Laxman Meena',
        subtitle: 'Engineering · Staff Frontend Engineer · 1 device, 2 software seats',
        action: () => {
          setActiveTab('hardware');
          addToast({
            title: 'Employee Profile: Laxman Meena',
            message: 'Holds NEX-MAC-35. Licensed for Cursor & Figma.',
            type: 'info',
          });
        },
      },
    ];
  } else {
    const q = query.toLowerCase();

    // 1. Assets
    const matchingAssets = assets
      .filter((a) => a.tag.toLowerCase().includes(q) || a.title.toLowerCase().includes(q))
      .slice(0, 4)
      .map((a) => ({
        id: a.id,
        type: 'asset' as const,
        title: `${a.tag} · ${a.title}`,
        subtitle: `${a.family} · ${a.status} · ${a.assignedToName ? `Held by ${a.assignedToName}` : 'Available'}`,
        action: () => {
          setActiveTab('hardware');
          setActiveDrawerAssetId(a.id);
        },
      }));

    // 2. Employees
    const matchingEmployees = employees
      .filter((e) => e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q))
      .slice(0, 3)
      .map((e) => {
        const heldAssets = assets.filter((a) => a.assignedTo === e.id);
        const heldSubs = subscriptions.filter((s) => s.assignedUsers.includes(e.id));
        return {
          id: e.id,
          type: 'employee' as const,
          title: `${e.name} (${e.department})`,
          subtitle: `${e.role} · ${heldAssets.length} device(s), ${heldSubs.length} software seat(s)`,
          action: () => {
            addToast({
              title: `Employee: ${e.name}`,
              message: `Equipment: ${heldAssets.map((a) => a.tag).join(', ') || 'None'}. Subscriptions: ${heldSubs.map((s) => s.name).join(', ') || 'None'}`,
              type: 'info',
            });
          },
        };
      });

    // 3. Subscriptions
    const matchingSubs = subscriptions
      .filter((s) => s.name.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q))
      .slice(0, 3)
      .map((s) => ({
        id: s.id,
        type: 'subscription' as const,
        title: `${s.name} (${s.provider})`,
        subtitle: `${s.type} · ${formatUSD(s.amount)} ${s.billingCycle} · Owner: ${s.ownerName}`,
        action: () => {
          setActiveTab('software');
          setActiveDrawerSubscriptionId(s.id);
        },
      }));

    items = [...matchingAssets, ...matchingEmployees, ...matchingSubs];
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((idx) => (idx + 1) % Math.max(1, items.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((idx) => (idx - 1 + items.length) % Math.max(1, items.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].action?.();
        setCommandPaletteOpen(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Palette Box */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search people, assets, subscriptions..."
            className="w-full text-sm bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-500 rounded border border-gray-200 dark:border-gray-700">
            Esc
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {items.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              No matching assets, employees, or subscriptions found for "{query}".
            </div>
          ) : (
            items.map((item, index) => {
              const isSelected = selectedIndex === index;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action?.();
                    setCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        item.type === 'action'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : item.type === 'asset'
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : item.type === 'employee'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      }`}
                    >
                      {item.type === 'action' ? (
                        <Sparkles className="w-4 h-4" />
                      ) : item.type === 'asset' ? (
                        <Laptop className="w-4 h-4" />
                      ) : item.type === 'employee' ? (
                        <Users className="w-4 h-4" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-xs truncate">{item.title}</div>
                      <div className="text-[11px] text-gray-400 truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-indigo-600 translate-x-0.5' : 'text-transparent'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="flex items-center gap-1 font-mono">
            <Command className="w-3 h-3" /> Quick Switcher
          </span>
        </div>
      </div>
    </div>
  );
};
