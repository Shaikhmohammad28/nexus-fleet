import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Modal } from '../../components/Modal';
import { AssignmentCategory } from '../../types';
import { Search, Laptop, UserCheck, Calendar, FileText } from 'lucide-react';
import { format, addMonths } from 'date-fns';

export const AssignDeviceModal: React.FC = () => {
  const {
    isAssignModalOpen,
    closeAssignModal,
    assignModalTargetAssetId,
    assignModalTargetJoinerId,
    assets,
    employees,
    newJoiners,
    assignAsset,
  } = useStore();

  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [category, setCategory] = useState<AssignmentCategory>('Permanent');
  const [returnDate, setReturnDate] = useState<string>(format(addMonths(new Date(), 3), 'yyyy-MM-dd'));
  const [note, setNote] = useState<string>('');
  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState<string>('');
  const [searchAssetQuery, setSearchAssetQuery] = useState<string>('');

  useEffect(() => {
    if (assignModalTargetAssetId) {
      setSelectedAssetId(assignModalTargetAssetId);
    } else {
      const firstAvailable = assets.find((a) => a.status === 'Available');
      setSelectedAssetId(firstAvailable?.id || '');
    }

    if (assignModalTargetJoinerId) {
      const joiner = newJoiners.find((j) => j.id === assignModalTargetJoinerId);
      if (joiner) {
        setNote(`Deployment for joiner: ${joiner.name} (${joiner.role})`);
      }
    }
  }, [assignModalTargetAssetId, assignModalTargetJoinerId, assets, newJoiners]);

  if (!isAssignModalOpen) return null;

  const targetAsset = assets.find((a) => a.id === selectedAssetId);
  const targetJoiner = newJoiners.find((j) => j.id === assignModalTargetJoinerId);

  const availableAssets = assets.filter((a) => a.status === 'Available');
  const filteredAvailableAssets = availableAssets.filter((a) =>
    a.tag.toLowerCase().includes(searchAssetQuery.toLowerCase()) ||
    a.title.toLowerCase().includes(searchAssetQuery.toLowerCase()) ||
    a.family.toLowerCase().includes(searchAssetQuery.toLowerCase())
  );

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(searchEmployeeQuery.toLowerCase()) ||
    e.department.toLowerCase().includes(searchEmployeeQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchEmployeeQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedAssetId) return;

    if (targetJoiner) {
      // Direct joiner assignment
      assignAsset(selectedAssetId, `emp-joiner-${targetJoiner.id}`, category, category === 'Temporary' ? returnDate : undefined, note);
    } else if (selectedEmpId) {
      assignAsset(selectedAssetId, selectedEmpId, category, category === 'Temporary' ? returnDate : undefined, note);
    }
    closeAssignModal();
  };

  const isSubmitDisabled = !selectedAssetId || (!selectedEmpId && !targetJoiner);

  return (
    <Modal
      isOpen={isAssignModalOpen}
      onClose={closeAssignModal}
      title={
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>
            {targetJoiner ? `Choose Device for ${targetJoiner.name}` : 'Assign Hardware Device'}
          </span>
        </div>
      }
      subtitle={
        targetAsset
          ? `Deploying ${targetAsset.tag} (${targetAsset.title})`
          : 'Select an available device and assign to team member'
      }
      maxWidth="lg"
      footer={
        <>
          <button
            onClick={closeAssignModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-btn transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitDisabled}
            onClick={handleAssign}
            className={`px-5 py-2 text-sm font-medium text-white rounded-btn transition-colors shadow-sm ${
              isSubmitDisabled
                ? 'bg-gray-400 cursor-not-allowed opacity-60'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'
            }`}
          >
            Confirm Assignment
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Device selection (if opened for joiner or no asset was pre-selected) */}
        {(!assignModalTargetAssetId || targetJoiner) && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Select Available Device ({availableAssets.length} Available)
            </label>
            <div className="relative mb-2">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchAssetQuery}
                onChange={(e) => setSearchAssetQuery(e.target.value)}
                placeholder="Search tag, model, or family..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900/50">
              {filteredAvailableAssets.slice(0, 15).map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedAssetId === asset.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Laptop className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-xs font-mono">{asset.tag}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{asset.title}</div>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                    {asset.family}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employee selection (if not opened directly from joiner card) */}
        {!targetJoiner && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Assignee (Team Member)*
            </label>
            <div className="relative mb-2">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchEmployeeQuery}
                onChange={(e) => setSearchEmployeeQuery(e.target.value)}
                placeholder="Search employee by name, department, role..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900/50">
              {filteredEmployees.slice(0, 15).map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmpId(emp.id)}
                  className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedEmpId === emp.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-medium shrink-0">
                      {emp.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-gray-900 dark:text-white">{emp.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{emp.role} · {emp.department}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignment Category Radios */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Assignment Category*
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['Permanent', 'Temporary', 'Shared'] as AssignmentCategory[]).map((cat) => (
              <label
                key={cat}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                  category === cat
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <input
                  type="radio"
                  name="assignment_category"
                  value={cat}
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                  className="sr-only"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Return Date picker if Temporary */}
        {category === 'Temporary' && (
          <div className="animate-in fade-in duration-150">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Scheduled Return Date*</span>
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <span>Deployment Note (Optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="e.g. Standard engineering kit with charger and USB-C adapter..."
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </Modal>
  );
};
