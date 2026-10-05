import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ProductFamily, GroupByOption } from '../../types';
import {
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  X,
  Layers,
  Columns3,
  RotateCcw,
  BookmarkPlus,
} from 'lucide-react';
import { downloadCsv, formatINR, formatDisplayDate } from '../../utils/formatters';

interface HardwareTableToolbarProps {
  filteredCount: number;
}

export const HardwareTableToolbar: React.FC<HardwareTableToolbarProps> = ({ filteredCount }) => {
  const {
    assets,
    searchQuery,
    setSearchQuery,
    filterFamily,
    setFilterFamily,
    filterPool,
    setFilterPool,
    filterWarranty,
    setFilterWarranty,
    groupBy,
    setGroupBy,
    tableDensity,
    setTableDensity,
    visibleColumns,
    toggleColumn,
    resetColumns,
    savedViews,
    activeSavedViewId,
    setActiveSavedViewId,
    addSavedView,
    clearHardwareFilters,
    setAddStockModalOpen,
    addToast,
  } = useStore();

  const [isColumnPopoverOpen, setIsColumnPopoverOpen] = useState(false);
  const [isSaveViewDialogOpen, setIsSaveViewDialogOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  // Active filter chips calculation
  const activeChips: { key: string; label: string; clear: () => void }[] = [];
  if (searchQuery) {
    activeChips.push({
      key: 'search',
      label: `Search: "${searchQuery}"`,
      clear: () => setSearchQuery(''),
    });
  }
  if (filterFamily !== 'All') {
    activeChips.push({
      key: 'family',
      label: `Family: ${filterFamily}`,
      clear: () => setFilterFamily('All'),
    });
  }
  if (filterPool !== 'All') {
    activeChips.push({
      key: 'pool',
      label: `Pool: ${filterPool}`,
      clear: () => setFilterPool('All'),
    });
  }
  if (filterWarranty !== 'Any') {
    activeChips.push({
      key: 'warranty',
      label: `Warranty: ${filterWarranty}`,
      clear: () => setFilterWarranty('Any'),
    });
  }

  const handleExportCsv = () => {
    const headers = [
      'Asset Tag',
      'Title',
      'Vendor',
      'Product Family',
      'Status',
      'Assigned To',
      'Department',
      'Assignment Category',
      'Purchase Date',
      'Price (INR)',
      'Warranty End',
      'Configuration',
    ];

    const rows = assets.map((a) => [
      a.tag,
      a.title,
      a.vendor,
      a.family,
      a.status,
      a.assignedToName || 'Unassigned',
      a.assignedToDepartment || '-',
      a.assignmentCategory || '-',
      formatDisplayDate(a.purchaseDate),
      formatINR(a.price),
      formatDisplayDate(a.warrantyEnd),
      a.configuration,
    ]);

    downloadCsv(`nexus_hardware_fleet_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    addToast({
      title: 'Exported CSV successfully',
      message: `${assets.length} hardware records downloaded.`,
      type: 'success',
    });
  };

  const handleSaveView = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViewName.trim()) return;
    addSavedView(newViewName.trim());
    setNewViewName('');
    setIsSaveViewDialogOpen(false);
  };

  return (
    <div className="space-y-4 mb-4">
      {/* Saved View Tabs Row with cleanly pinned counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2.5 gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {savedViews.map((view) => {
            const isActive = activeSavedViewId === view.id;
            let countLabel = '';
            if (view.id === 'view-all') countLabel = `(${assets.length})`;
            else if (view.id === 'view-unassigned')
              countLabel = `(${assets.filter((a) => a.status === 'Available').length})`;
            else if (view.id === 'view-warranty')
              countLabel = `(${assets.filter((a) => a.warrantyEnd && new Date(a.warrantyEnd) > new Date()).length})`;
            else if (view.id === 'view-missing')
              countLabel = `(${assets.filter((a) => a.family === 'Other').length})`;

            return (
              <button
                key={view.id}
                onClick={() => setActiveSavedViewId(view.id)}
                className={`h-8 px-3 text-xs font-semibold rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{view.name}</span>
                <span className="opacity-75 font-mono text-[11px]">{countLabel}</span>
              </button>
            );
          })}

          {/* Save current view button */}
          <button
            onClick={() => setIsSaveViewDialogOpen(true)}
            className="h-8 flex items-center gap-1 px-2.5 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>+ Save current view</span>
          </button>
        </div>

        {/* Live filtered count label */}
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 self-end sm:self-center">
          Showing <span className="font-bold text-slate-900 dark:text-white">{filteredCount}</span> of {assets.length} items
        </div>
      </div>

      {/* Save View Inline Modal */}
      {isSaveViewDialogOpen && (
        <form
          onSubmit={handleSaveView}
          className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-center gap-3 animate-in fade-in"
        >
          <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
            Save view as:
          </span>
          <input
            type="text"
            required
            autoFocus
            value={newViewName}
            onChange={(e) => setNewViewName(e.target.value)}
            placeholder="e.g. Engineering Mac Fleet"
            className="h-8 px-3 text-xs bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-500 flex-1 max-w-xs"
          />
          <button
            type="submit"
            className="h-8 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsSaveViewDialogOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Main Toolbar Controls Row (Uniform h-9 height on all elements) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Search & Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {/* Search Box */}
          <div className="relative min-w-[220px] max-w-xs flex-1 h-9">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tag, model, vendor, user..."
              className="w-full h-9 pl-9 pr-8 text-xs bg-white dark:bg-[#111726] border border-slate-200/90 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 shadow-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Product Family Dropdown */}
          <select
            value={filterFamily}
            onChange={(e) => setFilterFamily(e.target.value as ProductFamily | 'All')}
            className="h-9 px-3 text-xs font-medium bg-white dark:bg-[#111726] border border-slate-200/90 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer"
          >
            <option value="All">All families</option>
            <option value="Mac">Mac</option>
            <option value="Windows">Windows</option>
            <option value="Monitor">Monitor</option>
            <option value="Other">Other (Uncategorized)</option>
          </select>

          {/* Pool Dropdown */}
          <select
            value={filterPool}
            onChange={(e) => setFilterPool(e.target.value)}
            className="h-9 px-3 text-xs font-medium bg-white dark:bg-[#111726] border border-slate-200/90 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer"
          >
            <option value="All">All pools</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="In repair">In repair</option>
            <option value="Retired">Retired</option>
          </select>

          {/* Warranty Dropdown */}
          <select
            value={filterWarranty}
            onChange={(e) => setFilterWarranty(e.target.value)}
            className="h-9 px-3 text-xs font-medium bg-white dark:bg-[#111726] border border-slate-200/90 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer"
          >
            <option value="Any">Warranty: Any</option>
            <option value="Expiring in 30 days">Expiring in 30 days</option>
            <option value="Expired">Expired</option>
            <option value="Active">Active (&gt;30d)</option>
          </select>

          {/* Group By Dropdown */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800 h-9">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
              className="h-9 px-2.5 text-xs font-medium bg-white dark:bg-[#111726] border border-slate-200/90 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer"
            >
              <option value="None">Group by: None</option>
              <option value="Title">Title</option>
              <option value="Product Family">Product Family</option>
              <option value="Vendor">Vendor</option>
              <option value="Availability/Status">Availability/Status</option>
              <option value="Assigned/Unassigned">Assigned/Unassigned</option>
            </select>
          </div>
        </div>

        {/* Right: Actions (Columns, Density, CSV, Add Stock) - All aligned to h-9 */}
        <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
          {/* Columns Popover Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsColumnPopoverOpen(!isColumnPopoverOpen)}
              className="h-9 flex items-center gap-1.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111726] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 rounded-xl transition-all shadow-xs"
            >
              <Columns3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Columns</span>
            </button>

            {isColumnPopoverOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-30 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Toggle Columns</span>
                  <button
                    onClick={resetColumns}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {[
                    { key: 'tag', label: 'Asset Tag' },
                    { key: 'title', label: 'Title & Vendor' },
                    { key: 'family', label: 'Product Family' },
                    { key: 'assignedTo', label: 'Assigned To' },
                    { key: 'category', label: 'Assignment Category' },
                    { key: 'warranty', label: 'Warranty' },
                    { key: 'status', label: 'Pool Status' },
                  ].map((col) => (
                    <label key={col.key} className="flex items-center gap-2 cursor-pointer select-none py-0.5">
                      <input
                        type="checkbox"
                        checked={visibleColumns[col.key] !== false}
                        onChange={() => toggleColumn(col.key)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Density Toggle */}
          <button
            onClick={() => setTableDensity(tableDensity === 'Comfortable' ? 'Compact' : 'Comfortable')}
            title={`Density: ${tableDensity}`}
            className="h-9 w-9 flex items-center justify-center text-slate-600 dark:text-slate-300 bg-white dark:bg-[#111726] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 rounded-xl transition-all shadow-xs"
            aria-label="Toggle table density"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="h-9 flex items-center gap-1.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111726] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 rounded-xl transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          {/* + Add Inventory Stock */}
          <button
            onClick={() => setAddStockModalOpen(true)}
            className="h-9 flex items-center gap-1.5 px-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all focus:ring-2 focus:ring-indigo-500"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Stock</span>
          </button>
        </div>
      </div>

      {/* Row of Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 animate-in fade-in">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active filters:</span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            >
              <span>{chip.label}</span>
              <button
                onClick={chip.clear}
                className="hover:text-indigo-950 dark:hover:text-white"
                aria-label={`Remove filter ${chip.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={clearHardwareFilters}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
