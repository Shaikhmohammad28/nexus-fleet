import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { HardwareAsset, ProductFamily } from '../../types';
import { Chip } from '../../components/Chip';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  Copy,
  Pencil,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  UserPlus,
  ArrowUpDown,
  Laptop,
  Check,
} from 'lucide-react';
import { getWarrantyStatus } from '../../utils/formatters';

interface HardwareTableProps {
  onFilteredCountChange: (count: number) => void;
}

export const HardwareTable: React.FC<HardwareTableProps> = ({ onFilteredCountChange }) => {
  const {
    assets,
    selectedAssetIds,
    toggleSelectAsset,
    selectAllCurrentPage,
    searchQuery,
    filterFamily,
    filterPool,
    filterWarranty,
    groupBy,
    tableDensity,
    visibleColumns,
    inlineUpdateAsset,
    returnAssetToPool,
    markAssetInRepair,
    retireAsset,
    deleteAsset,
    duplicateAsset,
    setActiveDrawerAssetId,
    openAssignModal,
    addToast,
    clearHardwareFilters,
  } = useStore();

  // Sorting state
  const [sortField, setSortField] = useState<keyof HardwareAsset>('tag');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Inline editing state
  const [editingCell, setEditingCell] = useState<{ id: string; field: 'tag' | 'title'; value: string } | null>(null);

  // Kebab menu state
  const [activeKebabId, setActiveKebabId] = useState<string | null>(null);

  // Delete confirmation dialog
  const [deleteConfirmAsset, setDeleteConfirmAsset] = useState<HardwareAsset | null>(null);

  // Collapsed groups state
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Pagination state
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Inline family dropdown open
  const [familyDropdownAssetId, setFamilyDropdownAssetId] = useState<string | null>(null);

  // Filter and search computation
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTag = asset.tag.toLowerCase().includes(q);
        const matchesTitle = asset.title.toLowerCase().includes(q);
        const matchesVendor = asset.vendor.toLowerCase().includes(q);
        const matchesFamily = asset.family.toLowerCase().includes(q);
        const matchesAssignee = (asset.assignedToName || '').toLowerCase().includes(q);
        if (!matchesTag && !matchesTitle && !matchesVendor && !matchesFamily && !matchesAssignee) {
          return false;
        }
      }

      // Family
      if (filterFamily !== 'All' && asset.family !== filterFamily) {
        return false;
      }

      // Pool / Status
      if (filterPool !== 'All' && asset.status !== filterPool) {
        return false;
      }

      // Warranty
      if (filterWarranty !== 'Any') {
        const warranty = getWarrantyStatus(asset.warrantyEnd);
        if (filterWarranty === 'Expiring in 30 days' && !warranty.isExpiring30) return false;
        if (filterWarranty === 'Expired' && !warranty.isExpired) return false;
        if (filterWarranty === 'Active' && (warranty.isExpiring30 || warranty.isExpired)) return false;
      }

      return true;
    });
  }, [assets, searchQuery, filterFamily, filterPool, filterWarranty]);

  // Sync count to parent
  React.useEffect(() => {
    onFilteredCountChange(filteredAssets.length);
  }, [filteredAssets.length, onFilteredCountChange]);

  // Sort
  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      let aVal = a[sortField] ?? '';
      let bVal = b[sortField] ?? '';

      if (sortField === 'price') {
        return sortDirection === 'asc' ? (a.price - b.price) : (b.price - a.price);
      }

      if (sortField === 'warrantyEnd') {
        return sortDirection === 'asc'
          ? new Date(a.warrantyEnd).getTime() - new Date(b.warrantyEnd).getTime()
          : new Date(b.warrantyEnd).getTime() - new Date(a.warrantyEnd).getTime();
      }

      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredAssets, sortField, sortDirection]);

  // Grouping
  const groupedData = useMemo(() => {
    if (groupBy === 'None') return null;

    const groups: Record<string, HardwareAsset[]> = {};
    sortedAssets.forEach((asset) => {
      let key = 'Other';
      if (groupBy === 'Title') key = asset.title;
      else if (groupBy === 'Product Family') key = asset.family;
      else if (groupBy === 'Vendor') key = asset.vendor;
      else if (groupBy === 'Availability/Status') key = asset.status;
      else if (groupBy === 'Assigned/Unassigned') key = asset.status === 'Assigned' ? 'Assigned' : 'Unassigned';

      if (!groups[key]) groups[key] = [];
      groups[key].push(asset);
    });
    return groups;
  }, [sortedAssets, groupBy]);

  // Pagination for non-grouped view
  const totalPages = Math.max(1, Math.ceil(sortedAssets.length / pageSize));
  const paginatedAssets = useMemo(() => {
    if (groupBy !== 'None') return sortedAssets; // Grouped views show all or per-group
    const start = (currentPage - 1) * pageSize;
    return sortedAssets.slice(start, start + pageSize);
  }, [sortedAssets, currentPage, pageSize, groupBy]);

  const toggleSort = (field: keyof HardwareAsset) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const copyToClipboard = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tag);
    addToast({
      title: 'Copied',
      message: `${tag} copied to clipboard`,
      type: 'info',
      duration: 2000,
    });
  };

  const handleInlineEditSave = () => {
    if (editingCell && editingCell.value.trim()) {
      inlineUpdateAsset(editingCell.id, { [editingCell.field]: editingCell.value.trim() });
    }
    setEditingCell(null);
  };

  const isCurrentPageAllSelected =
    paginatedAssets.length > 0 &&
    paginatedAssets.every((a) => selectedAssetIds.includes(a.id));

  const isCurrentPageSomeSelected =
    paginatedAssets.some((a) => selectedAssetIds.includes(a.id)) && !isCurrentPageAllSelected;

  const rowPaddingClass = tableDensity === 'Compact' ? 'py-2 px-3' : 'py-3.5 px-4';

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-card border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto min-h-[380px]">
        <table className="w-full text-left border-collapse min-w-[1050px]">
          {/* Sticky Header */}
          <thead className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr className="h-11">
              {/* Checkbox */}
              {visibleColumns.checkbox !== false && (
                <th className={`w-12 text-center align-middle ${rowPaddingClass}`}>
                  <input
                    type="checkbox"
                    checked={isCurrentPageAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isCurrentPageSomeSelected;
                    }}
                    onChange={() => selectAllCurrentPage(paginatedAssets.map((a) => a.id))}
                    className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    aria-label="Select all on this page"
                  />
                </th>
              )}

              {/* Asset Tag */}
              {visibleColumns.tag !== false && (
                <th
                  onClick={() => toggleSort('tag')}
                  className={`cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 select-none align-middle ${rowPaddingClass}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Asset Tag</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
              )}

              {/* Title & Vendor */}
              {visibleColumns.title !== false && (
                <th
                  onClick={() => toggleSort('title')}
                  className={`cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 select-none align-middle ${rowPaddingClass}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Title & Vendor</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
              )}

              {/* Product Family */}
              {visibleColumns.family !== false && (
                <th
                  onClick={() => toggleSort('family')}
                  className={`cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 select-none align-middle ${rowPaddingClass}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Product Family</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
              )}

              {/* Assigned To */}
              {visibleColumns.assignedTo !== false && (
                <th
                  onClick={() => toggleSort('assignedToName')}
                  className={`cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 select-none align-middle ${rowPaddingClass}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Assigned To</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
              )}

              {/* Assignment Category */}
              {visibleColumns.category !== false && (
                <th className={`select-none align-middle ${rowPaddingClass}`}>
                  <span>Assignment Category</span>
                </th>
              )}

              {/* Warranty */}
              {visibleColumns.warranty !== false && (
                <th
                  onClick={() => toggleSort('warrantyEnd')}
                  className={`cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 select-none align-middle ${rowPaddingClass}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Warranty</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
              )}

              {/* Pool Status */}
              {visibleColumns.status !== false && (
                <th
                  onClick={() => toggleSort('status')}
                  className={`cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 select-none align-middle ${rowPaddingClass}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Pool Status</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
              )}

              {/* Actions */}
              <th className={`w-12 text-center align-middle ${rowPaddingClass}`}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs text-gray-700 dark:text-gray-300">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-16 px-4">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mb-3">
                      <Laptop className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      No assets match these filters
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Try adjusting or clearing your search term, product family, or warranty criteria.
                    </p>
                    <button
                      onClick={clearHardwareFilters}
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn shadow-sm transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : groupBy !== 'None' && groupedData ? (
              /* Grouped Rows */
              Object.entries(groupedData).map(([groupName, items]) => {
                const isGroupCollapsed = collapsedGroups[groupName];
                return (
                  <React.Fragment key={groupName}>
                    {/* Collapsible Group Header */}
                    <tr
                      onClick={() =>
                        setCollapsedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }))
                      }
                      className="bg-gray-50/80 dark:bg-gray-800/60 font-semibold cursor-pointer select-none border-t border-b border-gray-200 dark:border-gray-700"
                    >
                      <td colSpan={9} className="py-2.5 px-4 text-xs text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {isGroupCollapsed ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          )}
                          <span>{groupName}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-200/80 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-normal">
                            {items.length} items
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Group Items */}
                    {!isGroupCollapsed &&
                      items.map((asset) => renderTableRow(asset))}
                  </React.Fragment>
                );
              })
            ) : (
              /* Standard Paginated Rows */
              paginatedAssets.map((asset) => renderTableRow(asset))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {groupBy === 'None' && filteredAssets.length > 0 && (
        <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="flex items-center gap-3">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-indigo-500 text-gray-700 dark:text-gray-300"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>
              {Math.min((currentPage - 1) * pageSize + 1, filteredAssets.length)}-
              {Math.min(currentPage * pageSize, filteredAssets.length)} of {filteredAssets.length} · Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {/* Simple numbered pages */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pNum = currentPage - 2 + i;
                  if (pNum > totalPages) pNum = totalPages - (4 - i);
                }
                return (
                  <button
                    key={pNum}
                    onClick={() => setCurrentPage(pNum)}
                    className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                      currentPage === pNum
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmAsset && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteConfirmAsset(null)}
          onConfirm={() => {
            deleteAsset(deleteConfirmAsset.id);
            setDeleteConfirmAsset(null);
          }}
          title={`Delete Asset ${deleteConfirmAsset.tag}?`}
          message={`Are you sure you want to delete ${deleteConfirmAsset.tag} (${deleteConfirmAsset.title})? This will remove the asset from all pool KPIs and historical records.`}
          confirmLabel="Delete Asset"
          isDanger={true}
        />
      )}
    </div>
  );

  // Helper row renderer
  function renderTableRow(asset: HardwareAsset) {
    const isSelected = selectedAssetIds.includes(asset.id);
    const warranty = getWarrantyStatus(asset.warrantyEnd);

    return (
      <tr
        key={asset.id}
        onClick={(e) => {
          // If clicked directly on row, open drawer
          const target = e.target as HTMLElement;
          if (
            target.closest('input') ||
            target.closest('button') ||
            target.closest('select') ||
            target.closest('a')
          ) {
            return;
          }
          setActiveDrawerAssetId(asset.id);
        }}
        className={`group transition-colors cursor-pointer select-none align-middle ${
          asset.isHighlighted
            ? 'bg-indigo-100/70 dark:bg-indigo-900/50'
            : isSelected
            ? 'bg-indigo-50/50 dark:bg-indigo-950/30'
            : 'hover:bg-slate-50/80 dark:hover:bg-slate-900/50'
        }`}
      >
        {/* Checkbox */}
        {visibleColumns.checkbox !== false && (
          <td className={`text-center align-middle ${rowPaddingClass}`} onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelectAsset(asset.id)}
              className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </td>
        )}

        {/* Asset Tag (with pencil on hover & copy icon) */}
        {visibleColumns.tag !== false && (
          <td className={`align-middle ${rowPaddingClass} font-mono font-medium text-slate-900 dark:text-white`}>
            {editingCell?.id === asset.id && editingCell?.field === 'tag' ? (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  autoFocus
                  value={editingCell.value}
                  onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleInlineEditSave();
                    if (e.key === 'Escape') setEditingCell(null);
                  }}
                  className="px-2 py-1 text-xs border border-indigo-500 rounded bg-white dark:bg-gray-800 focus:outline-none"
                />
                <button
                  onClick={handleInlineEditSave}
                  className="p-1 text-indigo-600 hover:text-indigo-700"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group/tag">
                <span>{asset.tag}</span>
                <button
                  onClick={(e) => copyToClipboard(asset.tag, e)}
                  title="Copy tag"
                  className="opacity-0 group-hover/tag:opacity-100 p-1 text-gray-400 hover:text-indigo-600 transition-opacity"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCell({ id: asset.id, field: 'tag', value: asset.tag });
                  }}
                  title="Edit tag"
                  className="opacity-0 group-hover/tag:opacity-100 p-1 text-gray-400 hover:text-indigo-600 transition-opacity"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
            )}
          </td>
        )}

        {/* Title & Vendor */}
        {visibleColumns.title !== false && (
          <td className={`align-middle ${rowPaddingClass}`}>
            {editingCell?.id === asset.id && editingCell?.field === 'title' ? (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  autoFocus
                  value={editingCell.value}
                  onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleInlineEditSave();
                    if (e.key === 'Escape') setEditingCell(null);
                  }}
                  className="px-2 py-1 text-xs border border-indigo-500 rounded bg-white dark:bg-gray-800 focus:outline-none w-full min-w-[200px]"
                />
                <button
                  onClick={handleInlineEditSave}
                  className="p-1 text-indigo-600 hover:text-indigo-700"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="group/title flex items-center justify-between gap-1">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white leading-snug">
                    {asset.title}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">
                    {asset.vendor}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCell({ id: asset.id, field: 'title', value: asset.title });
                  }}
                  title="Edit title"
                  className="opacity-0 group-hover/title:opacity-100 p-1 text-gray-400 hover:text-indigo-600 transition-opacity"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
            )}
          </td>
        )}

        {/* Product Family */}
        {visibleColumns.family !== false && (
          <td className={`align-middle ${rowPaddingClass}`} onClick={(e) => e.stopPropagation()}>
            {asset.family === 'Other' ? (
              <div className="relative inline-block">
                <button
                  onClick={() =>
                    setFamilyDropdownAssetId(familyDropdownAssetId === asset.id ? null : asset.id)
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80 hover:bg-amber-200 transition-colors"
                >
                  <span>Uncategorized</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {familyDropdownAssetId === asset.id && (
                  <div className="absolute left-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-30 animate-in fade-in">
                    {(['Mac', 'Windows', 'Monitor'] as ProductFamily[]).map((fam) => (
                      <button
                        key={fam}
                        onClick={() => {
                          inlineUpdateAsset(asset.id, { family: fam });
                          setFamilyDropdownAssetId(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Chip
                          variant={fam === 'Mac' ? 'indigo' : fam === 'Windows' ? 'blue' : 'purple'}
                          size="sm"
                        >
                          {fam}
                        </Chip>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Chip
                variant={
                  asset.family === 'Mac'
                    ? 'indigo'
                    : asset.family === 'Windows'
                    ? 'blue'
                    : 'purple'
                }
                size="sm"
              >
                {asset.family}
              </Chip>
            )}
          </td>
        )}

        {/* Assigned To */}
        {visibleColumns.assignedTo !== false && (
          <td className={`align-middle ${rowPaddingClass}`} onClick={(e) => e.stopPropagation()}>
            {asset.assignedToName ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-[10px] shrink-0">
                  {asset.assignedToAvatar || asset.assignedToName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 dark:text-white truncate">
                    {asset.assignedToName}
                  </div>
                  {asset.assignedToDepartment && (
                    <div className="text-[10px] text-slate-400 truncate">
                      {asset.assignedToDepartment}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => openAssignModal({ assetId: asset.id })}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Assign</span>
              </button>
            )}
          </td>
        )}

        {/* Assignment Category */}
        {visibleColumns.category !== false && (
          <td className={`align-middle ${rowPaddingClass}`}>
            {asset.assignmentCategory ? (
              <Chip
                variant={
                  asset.assignmentCategory === 'Permanent'
                    ? 'blue'
                    : asset.assignmentCategory === 'Temporary'
                    ? 'amber'
                    : 'purple'
                }
                size="sm"
              >
                {asset.assignmentCategory}
              </Chip>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </td>
        )}

        {/* Warranty */}
        {visibleColumns.warranty !== false && (
          <td className={`align-middle ${rowPaddingClass}`}>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${warranty.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${warranty.dotClass}`} />
              <span>{warranty.label}</span>
            </span>
          </td>
        )}

        {/* Pool Status */}
        {visibleColumns.status !== false && (
          <td className={`align-middle ${rowPaddingClass}`}>
            <Chip
              variant={
                asset.status === 'Available'
                  ? 'indigo'
                  : asset.status === 'Assigned'
                  ? 'blue'
                  : asset.status === 'In repair'
                  ? 'amber'
                  : 'gray'
              }
              dot
              size="sm"
            >
              {asset.status}
            </Chip>
          </td>
        )}

        {/* Actions (Kebab) */}
        <td className={`align-middle text-right pr-4 ${rowPaddingClass}`} onClick={(e) => e.stopPropagation()}>
          <div className="relative inline-block">
            <button
              onClick={() => setActiveKebabId(activeKebabId === asset.id ? null : asset.id)}
              className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {activeKebabId === asset.id && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-30 animate-in fade-in zoom-in-95 text-xs text-gray-700 dark:text-gray-200 divide-y divide-gray-100 dark:divide-gray-700/60">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveDrawerAssetId(asset.id);
                      setActiveKebabId(null);
                    }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    View details
                  </button>
                  <button
                    onClick={() => {
                      openAssignModal({ assetId: asset.id });
                      setActiveKebabId(null);
                    }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {asset.status === 'Assigned' ? 'Reassign' : 'Assign to...'}
                  </button>
                  {asset.status === 'Assigned' && (
                    <button
                      onClick={() => {
                        returnAssetToPool(asset.id);
                        setActiveKebabId(null);
                      }}
                      className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Return to pool
                    </button>
                  )}
                  {asset.status !== 'In repair' && (
                    <button
                      onClick={() => {
                        markAssetInRepair(asset.id);
                        setActiveKebabId(null);
                      }}
                      className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Send to repair
                    </button>
                  )}
                  {asset.status !== 'Retired' && (
                    <button
                      onClick={() => {
                        retireAsset(asset.id);
                        setActiveKebabId(null);
                      }}
                      className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Retire asset
                    </button>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      duplicateAsset(asset.id);
                      setActiveKebabId(null);
                    }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      setDeleteConfirmAsset(asset);
                      setActiveKebabId(null);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    Delete asset
                  </button>
                </div>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  }
};
