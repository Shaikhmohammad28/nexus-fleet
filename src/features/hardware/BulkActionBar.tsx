import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ProductFamily } from '../../types';
import {
  Wrench,
  Trash2,
  Download,
  X,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { downloadCsv, formatINR, formatDisplayDate } from '../../utils/formatters';

interface BulkActionBarProps {
  totalMatching: number;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({ totalMatching }) => {
  const {
    selectedAssetIds,
    setSelectedAssetIds,
    clearSelection,
    assets,
    bulkSetFamily,
    bulkMarkInRepair,
    bulkDelete,
    openAssignModal,
    addToast,
  } = useStore();

  const [isFamilyDropdownOpen, setIsFamilyDropdownOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  if (selectedAssetIds.length === 0) return null;

  const count = selectedAssetIds.length;

  const handleSelectAllMatching = () => {
    setSelectedAssetIds(assets.map((a) => a.id));
    addToast({
      title: 'All matching assets selected',
      message: `Selected all ${assets.length} assets across all pages.`,
      type: 'info',
    });
  };

  const handleExportSelected = () => {
    const selectedAssets = assets.filter((a) => selectedAssetIds.includes(a.id));
    const headers = ['Asset Tag', 'Title', 'Vendor', 'Family', 'Status', 'Assigned To', 'Price'];
    const rows = selectedAssets.map((a) => [
      a.tag,
      a.title,
      a.vendor,
      a.family,
      a.status,
      a.assignedToName || 'Unassigned',
      formatINR(a.price),
    ]);
    downloadCsv(`selected_assets_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    addToast({
      title: 'Exported selected',
      message: `${count} asset records exported to CSV.`,
      type: 'success',
    });
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900/95 dark:bg-[#1E293B]/95 text-white backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-gray-700/60 flex flex-wrap items-center gap-3 sm:gap-4 text-xs animate-in slide-in-from-bottom-5 duration-200">
        {/* Count & Select all link */}
        <div className="flex items-center gap-2 border-r border-gray-700 pr-3">
          <span className="font-semibold text-white bg-indigo-600 px-2 py-0.5 rounded-full text-[11px]">
            {count}
          </span>
          <span className="font-medium text-gray-200">selected</span>
          {count < totalMatching && (
            <button
              onClick={handleSelectAllMatching}
              className="text-indigo-400 hover:text-indigo-300 underline font-normal ml-1"
            >
              Select all {totalMatching} matching
            </button>
          )}
        </div>

        {/* Action: Assign */}
        <button
          onClick={() => openAssignModal({ assetId: selectedAssetIds[0] })}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded-lg transition-colors border border-gray-700"
        >
          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Assign to...</span>
        </button>

        {/* Action: Set Family Popover */}
        <div className="relative">
          <button
            onClick={() => setIsFamilyDropdownOpen(!isFamilyDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded-lg transition-colors border border-gray-700"
          >
            <span>Set product family</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {isFamilyDropdownOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-36 bg-gray-900 border border-gray-700 rounded-xl shadow-xl py-1 z-50 animate-in fade-in">
              {(['Mac', 'Windows', 'Monitor', 'Other'] as ProductFamily[]).map((fam) => (
                <button
                  key={fam}
                  onClick={() => {
                    bulkSetFamily(fam);
                    setIsFamilyDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  {fam}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action: Mark In Repair */}
        <button
          onClick={bulkMarkInRepair}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded-lg transition-colors border border-gray-700"
        >
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          <span>Mark in repair</span>
        </button>

        {/* Action: Export */}
        <button
          onClick={handleExportSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded-lg transition-colors border border-gray-700"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export selected</span>
        </button>

        {/* Action: Delete */}
        <button
          onClick={() => setIsConfirmDeleteOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-red-200 rounded-lg transition-colors border border-red-800/60"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
          <span>Delete</span>
        </button>

        {/* Clear selection */}
        <button
          onClick={clearSelection}
          className="p-1.5 text-gray-400 hover:text-gray-200 ml-1 rounded-lg hover:bg-gray-800 transition-colors"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isConfirmDeleteOpen && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setIsConfirmDeleteOpen(false)}
          onConfirm={() => {
            bulkDelete();
            setIsConfirmDeleteOpen(false);
          }}
          title={`Delete ${count} selected assets?`}
          message={`Are you sure you want to permanently delete these ${count} hardware assets? All associated tracking and history will be cleared.`}
          confirmLabel="Delete All Selected"
          isDanger={true}
        />
      )}
    </>
  );
};
