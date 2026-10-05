import { create } from 'zustand';
import {
  HardwareAsset,
  Employee,
  NewJoiner,
  SoftwareSubscription,
  NotificationItem,
  ToastMessage,
  ProductFamily,
  AssetStatus,
  AssignmentCategory,
  TableDensity,
  GroupByOption,
  SavedView,
} from '../types';
import {
  INITIAL_EMPLOYEES,
  generateSeedAssets,
  generateSeedJoiners,
  generateSeedSubscriptions,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';
import { format, addMonths } from 'date-fns';

interface UndoAction {
  id: string;
  description: string;
  revert: () => void;
}

interface StoreState {
  // Navigation & Theme
  activeTab: 'hardware' | 'software';
  isLoadingTab: boolean;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setActiveTab: (tab: 'hardware' | 'software') => void;

  // Global Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  undoStack: UndoAction[];
  pushUndo: (description: string, revert: () => void) => void;
  performUndo: () => void;

  // Notifications & Global Shell
  notificationsEnabled: boolean;
  toggleNotificationsEnabled: () => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  stockThresholds: Record<ProductFamily, number>;
  setStockThreshold: (family: ProductFamily, threshold: number) => void;

  // Global Modals & Drawers
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isHelpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
  isReportIssueOpen: boolean;
  setReportIssueOpen: (open: boolean) => void;
  isStockAlertSettingsOpen: boolean;
  setStockAlertSettingsOpen: (open: boolean) => void;
  isPrototypeGuideOpen: boolean;
  setPrototypeGuideOpen: (open: boolean) => void;

  // Hardware State
  assets: HardwareAsset[];
  employees: Employee[];
  newJoiners: NewJoiner[];
  selectedAssetIds: string[];
  activeKpiFilter: string | null; // e.g. 'assigned' | 'unassigned' | 'warranty' | 'low-stock-Mac' | 'family-Mac' etc.
  hasDismissedAutoCategorizeBanner: boolean;
  setDismissAutoCategorizeBanner: (dismissed: boolean) => void;

  // Hardware Filters & Views
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterFamily: ProductFamily | 'All';
  setFilterFamily: (family: ProductFamily | 'All') => void;
  filterPool: string;
  setFilterPool: (pool: string) => void;
  filterWarranty: string;
  setFilterWarranty: (warranty: string) => void;
  groupBy: GroupByOption;
  setGroupBy: (groupBy: GroupByOption) => void;
  tableDensity: TableDensity;
  setTableDensity: (density: TableDensity) => void;
  visibleColumns: Record<string, boolean>;
  setVisibleColumns: (cols: Record<string, boolean>) => void;
  toggleColumn: (colKey: string) => void;
  resetColumns: () => void;
  savedViews: SavedView[];
  activeSavedViewId: string;
  setActiveSavedViewId: (id: string) => void;
  addSavedView: (name: string) => void;
  clearHardwareFilters: () => void;

  // Hardware Actions
  setActiveKpiFilter: (filter: string | null) => void;
  setSelectedAssetIds: (ids: string[]) => void;
  toggleSelectAsset: (id: string) => void;
  selectAllCurrentPage: (ids: string[]) => void;
  clearSelection: () => void;
  autoCategorizeAssets: () => { mac: number; windows: number; monitor: number; total: number };
  inlineUpdateAsset: (id: string, updates: Partial<HardwareAsset>) => void;
  assignAsset: (assetId: string, employeeId: string, category: AssignmentCategory, returnDate?: string, note?: string) => void;
  returnAssetToPool: (assetId: string) => void;
  markAssetInRepair: (assetId: string) => void;
  retireAsset: (assetId: string) => void;
  deleteAsset: (assetId: string) => void;
  duplicateAsset: (assetId: string) => void;
  addAssets: (newAssets: Omit<HardwareAsset, 'id'>[]) => void;
  assignSuggestedToJoiner: (joinerId: string) => void;

  // Hardware Drawer & Modals
  activeDrawerAssetId: string | null;
  setActiveDrawerAssetId: (id: string | null) => void;
  isAutoCategorizeModalOpen: boolean;
  setAutoCategorizeModalOpen: (open: boolean) => void;
  isAddStockModalOpen: boolean;
  setAddStockModalOpen: (open: boolean) => void;
  isAssignModalOpen: boolean;
  assignModalTargetAssetId: string | null;
  assignModalTargetJoinerId: string | null;
  openAssignModal: (target: { assetId?: string; joinerId?: string }) => void;
  closeAssignModal: () => void;

  // Bulk Actions
  bulkSetFamily: (family: ProductFamily) => void;
  bulkMarkInRepair: () => void;
  bulkDelete: () => void;

  // Software Subscriptions State
  subscriptions: SoftwareSubscription[];
  selectedMonth: number; // 0-11
  selectedYear: number;
  setSelectedMonthYear: (month: number, year: number) => void;
  softwareView: 'list' | 'insights';
  setSoftwareView: (view: 'list' | 'insights') => void;
  softwareSearchQuery: string;
  setSoftwareSearchQuery: (query: string) => void;
  softwareFilterStatus: string;
  setSoftwareFilterStatus: (status: string) => void;
  softwareFilterType: string;
  setSoftwareFilterType: (type: string) => void;
  clearSoftwareFilters: () => void;

  // Software Actions
  updateSubscriptionStatus: (id: string, status: SoftwareSubscription['status']) => void;
  toggleSubscriptionAutoRenew: (id: string) => void;
  renewSubscriptionNow: (id: string) => void;
  remindSubscription: (id: string) => void;
  addUserToSubscription: (subId: string, employeeId: string) => void;
  removeUserFromSubscription: (subId: string, employeeId: string) => void;
  addSubscription: (sub: Omit<SoftwareSubscription, 'id' | 'billingHistory' | 'activity'>) => void;
  updateSubscription: (id: string, updates: Partial<SoftwareSubscription>) => void;
  deleteSubscription: (id: string) => void;
  pauseSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;

  // Software Drawer & Modals
  activeDrawerSubscriptionId: string | null;
  setActiveDrawerSubscriptionId: (id: string | null) => void;
  isAddEditSubscriptionModalOpen: boolean;
  editingSubscriptionId: string | null;
  openAddSubscriptionModal: (subIdToEdit?: string) => void;
  closeAddEditSubscriptionModal: () => void;

  // Prototype Checklist
  completedChecklistSteps: string[];
  toggleChecklistStep: (stepId: string) => void;
}

const DEFAULT_COLUMNS = {
  checkbox: true,
  tag: true,
  title: true,
  family: true,
  assignedTo: true,
  category: true,
  warranty: true,
  status: true,
  actions: true,
};

const DEFAULT_SAVED_VIEWS: SavedView[] = [
  { id: 'view-all', name: 'All', filters: {} },
  { id: 'view-unassigned', name: 'Unassigned', filters: { pool: 'Available' } },
  { id: 'view-warranty', name: 'Warranty expiring', filters: { warranty: 'Expiring in 30 days' } },
  { id: 'view-missing', name: 'Missing family', filters: { missingFamily: true } },
];

export const useStore = create<StoreState>((set, get) => ({
  // Navigation & Theme
  activeTab: 'hardware',
  isLoadingTab: false,
  theme: (typeof window !== 'undefined' && localStorage.getItem('inventory_theme') as 'light' | 'dark') || 'light',
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('inventory_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(next);
  },
  setActiveTab: (tab) => {
    if (tab === get().activeTab) return;
    set({ isLoadingTab: true });
    setTimeout(() => {
      set({ activeTab: tab, isLoadingTab: false });
    }, 400); // 400ms skeleton loader requirement
  },

  // Global Toasts & Undo
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, duration: 5000, ...toast };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    if (newToast.duration) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
  undoStack: [],
  pushUndo: (description, revert) => {
    const action: UndoAction = { id: `undo-${Date.now()}`, description, revert };
    set((state) => ({ undoStack: [action, ...state.undoStack.slice(0, 19)] }));
  },
  performUndo: () => {
    const [action, ...rest] = get().undoStack;
    if (action) {
      action.revert();
      set({ undoStack: rest });
      get().addToast({
        title: 'Action undone',
        message: action.description,
        type: 'info',
      });
    }
  },

  // Notifications & Global Shell
  notificationsEnabled: true,
  toggleNotificationsEnabled: () => {
    const next = !get().notificationsEnabled;
    set({ notificationsEnabled: next });
    get().addToast({
      title: next ? 'Notifications enabled' : 'Notifications muted',
      message: next ? 'You will receive real-time stock and warranty alerts' : 'Alert banners only',
      type: next ? 'success' : 'info',
    });
  },
  notifications: INITIAL_NOTIFICATIONS,
  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },
  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
    get().addToast({ title: 'All notifications marked as read', type: 'info' });
  },
  stockThresholds: {
    Mac: 3,
    Windows: 3,
    Monitor: 3,
    Other: 3,
  },
  setStockThreshold: (family, threshold) => {
    set((state) => ({
      stockThresholds: { ...state.stockThresholds, [family]: threshold },
    }));
    get().addToast({
      title: `${family} alert threshold updated`,
      message: `Alert triggers when available stock falls to ${threshold} or below.`,
      type: 'info',
    });
  },

  // Modals
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  isHelpOpen: false,
  setHelpOpen: (open) => set({ isHelpOpen: open }),
  isReportIssueOpen: false,
  setReportIssueOpen: (open) => set({ isReportIssueOpen: open }),
  isStockAlertSettingsOpen: false,
  setStockAlertSettingsOpen: (open) => set({ isStockAlertSettingsOpen: open }),
  isPrototypeGuideOpen: false,
  setPrototypeGuideOpen: (open) => set({ isPrototypeGuideOpen: open }),

  // Hardware State
  assets: generateSeedAssets(),
  employees: INITIAL_EMPLOYEES,
  newJoiners: generateSeedJoiners(),
  selectedAssetIds: [],
  activeKpiFilter: null,
  hasDismissedAutoCategorizeBanner: false,
  setDismissAutoCategorizeBanner: (dismissed) => set({ hasDismissedAutoCategorizeBanner: dismissed }),

  // Hardware Filters
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  filterFamily: 'All',
  setFilterFamily: (family) => set({ filterFamily: family, activeSavedViewId: 'custom' }),
  filterPool: 'All',
  setFilterPool: (pool) => set({ filterPool: pool, activeSavedViewId: 'custom' }),
  filterWarranty: 'Any',
  setFilterWarranty: (warranty) => set({ filterWarranty: warranty, activeSavedViewId: 'custom' }),
  groupBy: 'None',
  setGroupBy: (groupBy) => set({ groupBy }),
  tableDensity: 'Comfortable',
  setTableDensity: (density) => set({ tableDensity: density }),
  visibleColumns: { ...DEFAULT_COLUMNS },
  setVisibleColumns: (cols) => set({ visibleColumns: cols }),
  toggleColumn: (colKey) =>
    set((state) => ({
      visibleColumns: { ...state.visibleColumns, [colKey]: !state.visibleColumns[colKey] },
    })),
  resetColumns: () => set({ visibleColumns: { ...DEFAULT_COLUMNS } }),
  savedViews: DEFAULT_SAVED_VIEWS,
  activeSavedViewId: 'view-all',
  setActiveSavedViewId: (id) => {
    const view = get().savedViews.find((v) => v.id === id);
    if (!view) return;
    set({
      activeSavedViewId: id,
      filterFamily: view.filters.family || 'All',
      filterPool: view.filters.pool || 'All',
      filterWarranty: view.filters.warranty || 'Any',
      searchQuery: view.filters.search || '',
      activeKpiFilter: null,
    });
  },
  addSavedView: (name) => {
    const current = get();
    const id = `view-${Date.now()}`;
    const newView: SavedView = {
      id,
      name,
      filters: {
        family: current.filterFamily,
        pool: current.filterPool,
        warranty: current.filterWarranty,
        search: current.searchQuery,
      },
    };
    set((state) => ({
      savedViews: [...state.savedViews, newView],
      activeSavedViewId: id,
    }));
    get().addToast({
      title: 'Saved view created',
      message: `"${name}" added to saved views.`,
      type: 'success',
    });
  },
  clearHardwareFilters: () => {
    set({
      searchQuery: '',
      filterFamily: 'All',
      filterPool: 'All',
      filterWarranty: 'Any',
      activeKpiFilter: null,
      activeSavedViewId: 'view-all',
    });
  },

  // KPI card selection
  setActiveKpiFilter: (filter) => {
    const current = get().activeKpiFilter;
    if (current === filter) {
      set({ activeKpiFilter: null, filterPool: 'All', filterWarranty: 'Any', filterFamily: 'All' });
    } else {
      set({ activeKpiFilter: filter });
      if (filter === 'assigned') {
        set({ filterPool: 'Assigned', filterFamily: 'All', filterWarranty: 'Any' });
      } else if (filter === 'unassigned') {
        set({ filterPool: 'Available', filterFamily: 'All', filterWarranty: 'Any' });
      } else if (filter === 'warranty') {
        set({ filterWarranty: 'Expiring in 30 days', filterPool: 'All', filterFamily: 'All' });
      } else if (filter?.startsWith('family-')) {
        const fam = filter.replace('family-', '') as ProductFamily;
        set({ filterFamily: fam });
      } else if (filter?.startsWith('low-stock-')) {
        const fam = filter.replace('low-stock-', '') as ProductFamily;
        set({ filterFamily: fam, filterPool: 'Available' });
      }
    }
  },

  // Row selection
  setSelectedAssetIds: (ids) => set({ selectedAssetIds: ids }),
  toggleSelectAsset: (id) =>
    set((state) => ({
      selectedAssetIds: state.selectedAssetIds.includes(id)
        ? state.selectedAssetIds.filter((item) => item !== id)
        : [...state.selectedAssetIds, id],
    })),
  selectAllCurrentPage: (ids) => {
    const { selectedAssetIds } = get();
    const allSelected = ids.every((id) => selectedAssetIds.includes(id));
    if (allSelected) {
      set({ selectedAssetIds: selectedAssetIds.filter((id) => !ids.includes(id)) });
    } else {
      const merged = Array.from(new Set([...selectedAssetIds, ...ids]));
      set({ selectedAssetIds: merged });
    }
  },
  clearSelection: () => set({ selectedAssetIds: [] }),

  // Auto-categorize
  autoCategorizeAssets: () => {
    const prevAssets = [...get().assets];
    let mac = 0;
    let windows = 0;
    let monitor = 0;

    const updated = prevAssets.map((asset) => {
      if (asset.family !== 'Other') return asset;

      const titleLower = asset.title.toLowerCase();
      let newFamily: ProductFamily = 'Other';

      if (titleLower.includes('macbook') || titleLower.includes('apple') || titleLower.includes('mac')) {
        newFamily = 'Mac';
        mac++;
      } else if (
        titleLower.includes('dell') ||
        titleLower.includes('lenovo') ||
        titleLower.includes('thinkpad') ||
        titleLower.includes('latitude') ||
        titleLower.includes('xps') ||
        titleLower.includes('precision')
      ) {
        newFamily = 'Windows';
        windows++;
      } else if (
        titleLower.includes('monitor') ||
        titleLower.includes('ultrafine') ||
        titleLower.includes('ultrasharp') ||
        titleLower.includes('display')
      ) {
        newFamily = 'Monitor';
        monitor++;
      }

      return { ...asset, family: newFamily };
    });

    const total = mac + windows + monitor;
    set({
      assets: updated,
      hasDismissedAutoCategorizeBanner: true,
    });

    // Provide real Undo
    const undoCallback = () => {
      set({
        assets: prevAssets,
        hasDismissedAutoCategorizeBanner: false,
      });
    };
    get().pushUndo(`Revert categorization of ${total} assets`, undoCallback);

    get().addToast({
      title: `${total} assets categorized`,
      message: `Categorized into ${mac} Mac, ${windows} Windows, and ${monitor} Monitor`,
      type: 'success',
      undoAction: () => {
        get().performUndo();
      },
    });

    return { mac, windows, monitor, total };
  },

  // Single asset actions
  inlineUpdateAsset: (id, updates) => {
    const prev = get().assets.find((a) => a.id === id);
    if (!prev) return;

    set((state) => ({
      assets: state.assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));

    const undoCallback = () => {
      set((state) => ({
        assets: state.assets.map((a) => (a.id === id ? prev : a)),
      }));
    };
    get().pushUndo(`Revert update to ${prev.tag}`, undoCallback);

    get().addToast({
      title: 'Saved',
      message: `Asset ${prev.tag} updated.`,
      type: 'success',
      undoAction: () => get().performUndo(),
    });
  },

  assignAsset: (assetId, employeeId, category, returnDate, note) => {
    const asset = get().assets.find((a) => a.id === assetId);
    const emp = get().employees.find((e) => e.id === employeeId);
    if (!asset || !emp) return;

    const prevAsset = { ...asset };
    const today = format(new Date(), 'yyyy-MM-dd');

    const newHistory = [
      ...asset.history,
      {
        id: `hist-${Date.now()}`,
        date: today,
        action: `Assigned to ${emp.name}`,
        actor: 'Admin User',
        details: `${category} assignment${returnDate ? ` (Return by: ${returnDate})` : ''}${note ? `. Note: ${note}` : ''}`,
      },
    ];

    set((state) => ({
      assets: state.assets.map((a) =>
        a.id === assetId
          ? {
              ...a,
              status: 'Assigned',
              assignedTo: emp.id,
              assignedToName: emp.name,
              assignedToAvatar: emp.avatar,
              assignedToDepartment: emp.department,
              assignmentCategory: category,
              temporaryReturnDate: returnDate,
              history: newHistory,
            }
          : a
      ),
    }));

    const undoCallback = () => {
      set((state) => ({
        assets: state.assets.map((a) => (a.id === assetId ? prevAsset : a)),
      }));
    };
    get().pushUndo(`Unassign ${asset.tag} from ${emp.name}`, undoCallback);

    get().addToast({
      title: `${asset.tag} assigned to ${emp.name}`,
      message: `${category} deployment in ${emp.department}`,
      type: 'success',
      undoAction: () => get().performUndo(),
    });
  },

  returnAssetToPool: (assetId) => {
    const asset = get().assets.find((a) => a.id === assetId);
    if (!asset) return;

    const prevAsset = { ...asset };
    const today = format(new Date(), 'yyyy-MM-dd');

    set((state) => ({
      assets: state.assets.map((a) =>
        a.id === assetId
          ? {
              ...a,
              status: 'Available',
              assignedTo: null,
              assignedToName: undefined,
              assignedToAvatar: undefined,
              assignedToDepartment: undefined,
              assignmentCategory: null,
              history: [
                ...a.history,
                {
                  id: `hist-${Date.now()}`,
                  date: today,
                  action: 'Returned to available pool',
                  actor: 'Admin User',
                  details: `Previously held by ${prevAsset.assignedToName || 'employee'}`,
                },
              ],
            }
          : a
      ),
    }));

    const undoCallback = () => {
      set((state) => ({
        assets: state.assets.map((a) => (a.id === assetId ? prevAsset : a)),
      }));
    };
    get().pushUndo(`Re-assign ${asset.tag} to ${prevAsset.assignedToName}`, undoCallback);

    get().addToast({
      title: `${asset.tag} returned to pool`,
      message: 'Asset is now Available for deployment.',
      type: 'info',
      undoAction: () => get().performUndo(),
    });
  },

  markAssetInRepair: (assetId) => {
    const asset = get().assets.find((a) => a.id === assetId);
    if (!asset) return;
    const prevAsset = { ...asset };
    const today = format(new Date(), 'yyyy-MM-dd');

    set((state) => ({
      assets: state.assets.map((a) =>
        a.id === assetId
          ? {
              ...a,
              status: 'In repair',
              history: [
                ...a.history,
                {
                  id: `hist-${Date.now()}`,
                  date: today,
                  action: 'Sent to repair center',
                  actor: 'Admin User',
                  details: 'Hardware diagnostics and warranty maintenance',
                },
              ],
            }
          : a
      ),
    }));

    const undoCallback = () => {
      set((state) => ({
        assets: state.assets.map((a) => (a.id === assetId ? prevAsset : a)),
      }));
    };
    get().pushUndo(`Restore ${asset.tag} status`, undoCallback);

    get().addToast({
      title: `${asset.tag} sent to repair`,
      message: 'Status updated to In repair.',
      type: 'warning',
      undoAction: () => get().performUndo(),
    });
  },

  retireAsset: (assetId) => {
    const asset = get().assets.find((a) => a.id === assetId);
    if (!asset) return;
    const prevAsset = { ...asset };
    const today = format(new Date(), 'yyyy-MM-dd');

    set((state) => ({
      assets: state.assets.map((a) =>
        a.id === assetId
          ? {
              ...a,
              status: 'Retired',
              assignedTo: null,
              assignedToName: undefined,
              history: [
                ...a.history,
                {
                  id: `hist-${Date.now()}`,
                  date: today,
                  action: 'Asset decommissioned and retired',
                  actor: 'Admin User',
                  details: 'End of hardware lifecycle',
                },
              ],
            }
          : a
      ),
    }));

    const undoCallback = () => {
      set((state) => ({
        assets: state.assets.map((a) => (a.id === assetId ? prevAsset : a)),
      }));
    };
    get().pushUndo(`Unretire ${asset.tag}`, undoCallback);

    get().addToast({
      title: `${asset.tag} retired`,
      message: 'Asset marked as decommissioned.',
      type: 'info',
      undoAction: () => get().performUndo(),
    });
  },

  deleteAsset: (assetId) => {
    const asset = get().assets.find((a) => a.id === assetId);
    if (!asset) return;
    const prevAssets = [...get().assets];

    set((state) => ({
      assets: state.assets.filter((a) => a.id !== assetId),
      selectedAssetIds: state.selectedAssetIds.filter((id) => id !== assetId),
      activeDrawerAssetId: state.activeDrawerAssetId === assetId ? null : state.activeDrawerAssetId,
    }));

    const undoCallback = () => {
      set({ assets: prevAssets });
    };
    get().pushUndo(`Restore deleted asset ${asset.tag}`, undoCallback);

    get().addToast({
      title: `Asset ${asset.tag} deleted`,
      type: 'danger',
      undoAction: () => get().performUndo(),
    });
  },

  duplicateAsset: (assetId) => {
    const asset = get().assets.find((a) => a.id === assetId);
    if (!asset) return;

    const nextId = `asset-${Date.now()}`;
    const nextTag = `NEX-${asset.family.toUpperCase()}-${Math.floor(250 + Math.random() * 500)}`;
    const cloned: HardwareAsset = {
      ...asset,
      id: nextId,
      tag: nextTag,
      status: 'Available',
      assignedTo: null,
      assignedToName: undefined,
      assignedToAvatar: undefined,
      assignedToDepartment: undefined,
      assignmentCategory: null,
      isHighlighted: true,
      history: [
        {
          id: `hist-${Date.now()}`,
          date: format(new Date(), 'yyyy-MM-dd'),
          action: `Duplicated from ${asset.tag}`,
          actor: 'Admin User',
        },
      ],
    };

    set((state) => ({
      assets: [cloned, ...state.assets],
    }));

    setTimeout(() => {
      set((state) => ({
        assets: state.assets.map((a) => (a.id === nextId ? { ...a, isHighlighted: false } : a)),
      }));
    }, 3000);

    get().addToast({
      title: `Duplicated as ${nextTag}`,
      message: 'Added to available stock.',
      type: 'success',
    });
  },

  addAssets: (newAssets) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const created = newAssets.map((item, idx) => {
      const id = `asset-${Date.now()}-${idx}`;
      return {
        ...item,
        id,
        isHighlighted: true,
        history: [
          {
            id: `hist-${Date.now()}-${idx}`,
            date: today,
            action: 'Added to inventory stock',
            actor: 'Admin User',
            details: `Initial procurement from ${item.vendor}`,
          },
        ],
      } as HardwareAsset;
    });

    const prevAssets = [...get().assets];
    set((state) => ({
      assets: [...created, ...state.assets],
    }));

    // Remove highlight after 3 seconds as required
    setTimeout(() => {
      set((state) => ({
        assets: state.assets.map((a) => (a.isHighlighted ? { ...a, isHighlighted: false } : a)),
      }));
    }, 3000);

    const undoCallback = () => {
      set({ assets: prevAssets });
    };
    get().pushUndo(`Remove ${created.length} added assets`, undoCallback);

    get().addToast({
      title: `${created.length} assets added`,
      message: `Created tags ${created[0]?.tag} to ${created[created.length - 1]?.tag}`,
      type: 'success',
      undoAction: () => get().performUndo(),
    });
  },

  assignSuggestedToJoiner: (joinerId) => {
    const joiner = get().newJoiners.find((j) => j.id === joinerId);
    if (!joiner) return;

    // Find available asset matching suggested or first available
    const availableAsset =
      get().assets.find((a) => a.id === joiner.suggestedAssetId && a.status === 'Available') ||
      get().assets.find((a) => a.status === 'Available');

    if (!availableAsset) {
      get().addToast({
        title: 'No available devices',
        message: 'Add more inventory stock before assigning to joiners.',
        type: 'danger',
      });
      return;
    }

    const prevAssets = [...get().assets];
    const prevJoiners = [...get().newJoiners];
    const today = format(new Date(), 'yyyy-MM-dd');

    set((state) => ({
      newJoiners: state.newJoiners.filter((j) => j.id !== joinerId),
      assets: state.assets.map((a) =>
        a.id === availableAsset.id
          ? {
              ...a,
              status: 'Assigned',
              assignedTo: `emp-joiner-${joiner.id}`,
              assignedToName: joiner.name,
              assignedToAvatar: joiner.avatar,
              assignedToDepartment: joiner.department,
              assignmentCategory: 'Permanent',
              history: [
                ...a.history,
                {
                  id: `hist-${Date.now()}`,
                  date: today,
                  action: `Assigned to joiner ${joiner.name}`,
                  actor: 'Onboarding System',
                  details: `Provisioned for ${joiner.role} (${joiner.department})`,
                },
              ],
            }
          : a
      ),
    }));

    const undoCallback = () => {
      set({
        assets: prevAssets,
        newJoiners: prevJoiners,
      });
    };
    get().pushUndo(`Revert assignment of ${availableAsset.tag} to ${joiner.name}`, undoCallback);

    get().addToast({
      title: `${availableAsset.tag} assigned to ${joiner.name}`,
      message: `Onboarding laptop provisioned for ${joiner.department}`,
      type: 'success',
      undoAction: () => get().performUndo(),
    });
  },

  // Drawer & Modals state
  activeDrawerAssetId: null,
  setActiveDrawerAssetId: (id) => set({ activeDrawerAssetId: id }),
  isAutoCategorizeModalOpen: false,
  setAutoCategorizeModalOpen: (open) => set({ isAutoCategorizeModalOpen: open }),
  isAddStockModalOpen: false,
  setAddStockModalOpen: (open) => set({ isAddStockModalOpen: open }),
  isAssignModalOpen: false,
  assignModalTargetAssetId: null,
  assignModalTargetJoinerId: null,
  openAssignModal: ({ assetId, joinerId }) =>
    set({
      isAssignModalOpen: true,
      assignModalTargetAssetId: assetId || null,
      assignModalTargetJoinerId: joinerId || null,
    }),
  closeAssignModal: () =>
    set({
      isAssignModalOpen: false,
      assignModalTargetAssetId: null,
      assignModalTargetJoinerId: null,
    }),

  // Bulk actions
  bulkSetFamily: (family) => {
    const { selectedAssetIds, assets } = get();
    const prevAssets = [...assets];

    set((state) => ({
      assets: state.assets.map((a) => (selectedAssetIds.includes(a.id) ? { ...a, family } : a)),
      selectedAssetIds: [],
    }));

    const undoCallback = () => set({ assets: prevAssets });
    get().pushUndo(`Revert bulk family update (${selectedAssetIds.length} assets)`, undoCallback);

    get().addToast({
      title: `Updated ${selectedAssetIds.length} assets`,
      message: `Product family set to ${family}.`,
      type: 'success',
      undoAction: () => get().performUndo(),
    });
  },

  bulkMarkInRepair: () => {
    const { selectedAssetIds, assets } = get();
    const prevAssets = [...assets];

    set((state) => ({
      assets: state.assets.map((a) => (selectedAssetIds.includes(a.id) ? { ...a, status: 'In repair' } : a)),
      selectedAssetIds: [],
    }));

    const undoCallback = () => set({ assets: prevAssets });
    get().pushUndo(`Restore status of ${selectedAssetIds.length} assets`, undoCallback);

    get().addToast({
      title: `${selectedAssetIds.length} assets marked In repair`,
      type: 'warning',
      undoAction: () => get().performUndo(),
    });
  },

  bulkDelete: () => {
    const { selectedAssetIds, assets } = get();
    const prevAssets = [...assets];

    set((state) => ({
      assets: state.assets.filter((a) => !selectedAssetIds.includes(a.id)),
      selectedAssetIds: [],
    }));

    const undoCallback = () => set({ assets: prevAssets });
    get().pushUndo(`Restore ${selectedAssetIds.length} deleted assets`, undoCallback);

    get().addToast({
      title: `${selectedAssetIds.length} assets deleted`,
      type: 'danger',
      undoAction: () => get().performUndo(),
    });
  },

  // ===================== SOFTWARE STATE =====================
  subscriptions: generateSeedSubscriptions(),
  selectedMonth: 8, // September (0-indexed: 8)
  selectedYear: 2026,
  setSelectedMonthYear: (month, year) => set({ selectedMonth: month, selectedYear: year }),
  softwareView: 'list',
  setSoftwareView: (view) => set({ softwareView: view }),
  softwareSearchQuery: '',
  setSoftwareSearchQuery: (query) => set({ softwareSearchQuery: query }),
  softwareFilterStatus: 'All',
  setSoftwareFilterStatus: (status) => set({ softwareFilterStatus: status }),
  softwareFilterType: 'All',
  setSoftwareFilterType: (type) => set({ softwareFilterType: type }),
  clearSoftwareFilters: () => {
    set({
      softwareSearchQuery: '',
      softwareFilterStatus: 'All',
      softwareFilterType: 'All',
    });
  },

  updateSubscriptionStatus: (id, status) => {
    const sub = get().subscriptions.find((s) => s.id === id);
    if (!sub) return;
    const prevStatus = sub.status;

    set((state) => ({
      subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, status } : s)),
    }));

    const undoCallback = () => {
      set((state) => ({
        subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, status: prevStatus } : s)),
      }));
    };
    get().pushUndo(`Revert ${sub.name} status to ${prevStatus}`, undoCallback);

    get().addToast({
      title: `${sub.name} status updated`,
      message: `Status is now ${status}.`,
      type: 'info',
      undoAction: () => get().performUndo(),
    });
  },

  toggleSubscriptionAutoRenew: (id) => {
    const sub = get().subscriptions.find((s) => s.id === id);
    if (!sub) return;
    const next = !sub.autoRenew;

    set((state) => ({
      subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, autoRenew: next } : s)),
    }));

    get().addToast({
      title: `${sub.name} auto-renewal ${next ? 'enabled' : 'disabled'}`,
      type: next ? 'success' : 'warning',
    });
  },

  renewSubscriptionNow: (id) => {
    const sub = get().subscriptions.find((s) => s.id === id);
    if (!sub) return;
    const prevNextDate = sub.nextRenewalDate;
    const newNextDate = format(addMonths(new Date(prevNextDate), sub.billingCycle === 'Yearly' ? 12 : 1), 'yyyy-MM-dd');

    set((state) => ({
      subscriptions: state.subscriptions.map((s) =>
        s.id === id
          ? {
              ...s,
              nextRenewalDate: newNextDate,
              activity: [
                {
                  id: `act-${Date.now()}`,
                  date: format(new Date(), 'yyyy-MM-dd'),
                  description: `Manual renewal confirmed. Next renewal set to ${newNextDate}`,
                  user: 'Admin User',
                },
                ...s.activity,
              ],
            }
          : s
      ),
    }));

    const undoCallback = () => {
      set((state) => ({
        subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, nextRenewalDate: prevNextDate } : s)),
      }));
    };
    get().pushUndo(`Revert ${sub.name} renewal`, undoCallback);

    get().addToast({
      title: `${sub.name} renewed`,
      message: `Next billing date scheduled for ${newNextDate}.`,
      type: 'success',
      undoAction: () => get().performUndo(),
    });
  },

  remindSubscription: (id) => {
    const sub = get().subscriptions.find((s) => s.id === id);
    if (!sub) return;

    get().addToast({
      title: `Reminder set for ${sub.name}`,
      message: `Alert will trigger 7 days before renewal on ${sub.nextRenewalDate}.`,
      type: 'info',
    });
  },

  addUserToSubscription: (subId, employeeId) => {
    const sub = get().subscriptions.find((s) => s.id === subId);
    const emp = get().employees.find((e) => e.id === employeeId);
    if (!sub || !emp || sub.assignedUsers.includes(employeeId)) return;

    const prevUsers = [...sub.assignedUsers];
    const newUsers = [...prevUsers, employeeId];
    // If seat based, calculate new amount if total seats adjusted
    const newTotal = sub.totalSeats ? Math.max(sub.totalSeats, newUsers.length) : newUsers.length;
    const newAmount = sub.type === 'Seat based' && sub.pricePerSeat ? newTotal * sub.pricePerSeat : sub.amount;

    set((state) => ({
      subscriptions: state.subscriptions.map((s) =>
        s.id === subId
          ? {
              ...s,
              assignedUsers: newUsers,
              totalSeats: newTotal,
              amount: newAmount,
              activity: [
                {
                  id: `act-${Date.now()}`,
                  date: format(new Date(), 'yyyy-MM-dd'),
                  description: `Assigned license seat to ${emp.name}`,
                  user: 'Admin User',
                },
                ...s.activity,
              ],
            }
          : s
      ),
    }));

    const undoCallback = () => {
      set((state) => ({
        subscriptions: state.subscriptions.map((s) => (s.id === subId ? { ...s, assignedUsers: prevUsers } : s)),
      }));
    };
    get().pushUndo(`Remove ${emp.name} from ${sub.name}`, undoCallback);

    get().addToast({
      title: `Seat assigned to ${emp.name}`,
      message: `${sub.name} utilization updated live (${newUsers.length} / ${newTotal} seats).`,
      type: 'success',
      undoAction: () => get().performUndo(),
    });
  },

  removeUserFromSubscription: (subId, employeeId) => {
    const sub = get().subscriptions.find((s) => s.id === subId);
    const emp = get().employees.find((e) => e.id === employeeId);
    if (!sub || !emp) return;

    const prevUsers = [...sub.assignedUsers];
    const newUsers = prevUsers.filter((id) => id !== employeeId);

    set((state) => ({
      subscriptions: state.subscriptions.map((s) =>
        s.id === subId
          ? {
              ...s,
              assignedUsers: newUsers,
              activity: [
                {
                  id: `act-${Date.now()}`,
                  date: format(new Date(), 'yyyy-MM-dd'),
                  description: `Revoked seat license from ${emp.name}`,
                  user: 'Admin User',
                },
                ...s.activity,
              ],
            }
          : s
      ),
    }));

    const undoCallback = () => {
      set((state) => ({
        subscriptions: state.subscriptions.map((s) => (s.id === subId ? { ...s, assignedUsers: prevUsers } : s)),
      }));
    };
    get().pushUndo(`Re-assign ${emp.name} to ${sub.name}`, undoCallback);

    get().addToast({
      title: `Seat revoked from ${emp.name}`,
      message: `${sub.name} now has ${newUsers.length} of ${sub.totalSeats || newUsers.length} seats used.`,
      type: 'info',
      undoAction: () => get().performUndo(),
    });
  },

  addSubscription: (subData) => {
    const id = `sub-${Date.now()}`;
    const today = format(new Date(), 'yyyy-MM-dd');
    const newSub: SoftwareSubscription = {
      ...subData,
      id,
      billingHistory: [
        {
          id: `b-new-${Date.now()}`,
          date: today,
          amount: subData.amount,
          status: 'Paid',
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        },
      ],
      activity: [
        {
          id: `act-${Date.now()}`,
          date: today,
          description: `Subscription created by Admin User`,
          user: 'Admin User',
        },
      ],
    };

    const prevSubs = [...get().subscriptions];
    set((state) => ({
      subscriptions: [newSub, ...state.subscriptions],
    }));

    const undoCallback = () => set({ subscriptions: prevSubs });
    get().pushUndo(`Delete newly added subscription ${newSub.name}`, undoCallback);

    get().addToast({
      title: `${newSub.name} subscription added`,
      message: `${newSub.type} billing: $${newSub.amount.toFixed(2)} USD`,
      type: 'success',
      undoAction: () => get().performUndo(),
    });
  },

  updateSubscription: (id, updates) => {
    const sub = get().subscriptions.find((s) => s.id === id);
    if (!sub) return;
    const prevSub = { ...sub };

    set((state) => ({
      subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));

    const undoCallback = () => {
      set((state) => ({
        subscriptions: state.subscriptions.map((s) => (s.id === id ? prevSub : s)),
      }));
    };
    get().pushUndo(`Revert edits to ${sub.name}`, undoCallback);

    get().addToast({
      title: `${sub.name} changes saved`,
      type: 'success',
      undoAction: () => get().performUndo(),
    });
  },

  deleteSubscription: (id) => {
    const sub = get().subscriptions.find((s) => s.id === id);
    if (!sub) return;
    const prevSubs = [...get().subscriptions];

    set((state) => ({
      subscriptions: state.subscriptions.filter((s) => s.id !== id),
      activeDrawerSubscriptionId: state.activeDrawerSubscriptionId === id ? null : state.activeDrawerSubscriptionId,
    }));

    const undoCallback = () => set({ subscriptions: prevSubs });
    get().pushUndo(`Restore deleted subscription ${sub.name}`, undoCallback);

    get().addToast({
      title: `${sub.name} deleted`,
      type: 'danger',
      undoAction: () => get().performUndo(),
    });
  },

  pauseSubscription: (id) => {
    get().updateSubscriptionStatus(id, 'Paused');
  },

  cancelSubscription: (id) => {
    get().updateSubscriptionStatus(id, 'Cancelled');
  },

  activeDrawerSubscriptionId: null,
  setActiveDrawerSubscriptionId: (id) => set({ activeDrawerSubscriptionId: id }),
  isAddEditSubscriptionModalOpen: false,
  editingSubscriptionId: null,
  openAddSubscriptionModal: (subIdToEdit) =>
    set({
      isAddEditSubscriptionModalOpen: true,
      editingSubscriptionId: subIdToEdit || null,
    }),
  closeAddEditSubscriptionModal: () =>
    set({
      isAddEditSubscriptionModalOpen: false,
      editingSubscriptionId: null,
    }),

  // Prototype Checklist
  completedChecklistSteps: [],
  toggleChecklistStep: (stepId) =>
    set((state) => ({
      completedChecklistSteps: state.completedChecklistSteps.includes(stepId)
        ? state.completedChecklistSteps.filter((id) => id !== stepId)
        : [...state.completedChecklistSteps, stepId],
    })),
}));
