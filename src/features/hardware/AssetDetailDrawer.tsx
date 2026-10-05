import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Drawer } from '../../components/Drawer';
import { Chip } from '../../components/Chip';
import { ProductFamily } from '../../types';
import {
  Laptop,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Cpu,
  Building,
  UserCheck,
  Clock,
  FileText,
  Download,
  Eye,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { formatINR, formatDisplayDate, getWarrantyStatus } from '../../utils/formatters';

export const AssetDetailDrawer: React.FC = () => {
  const {
    activeDrawerAssetId,
    setActiveDrawerAssetId,
    assets,
    inlineUpdateAsset,
    returnAssetToPool,
    markAssetInRepair,
    retireAsset,
    openAssignModal,
    addToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'documents'>('overview');
  const [isPreviewingInvoice, setIsPreviewingInvoice] = useState(false);

  if (!activeDrawerAssetId) return null;

  const asset = assets.find((a) => a.id === activeDrawerAssetId);
  if (!asset) return null;

  const warranty = getWarrantyStatus(asset.warrantyEnd);

  return (
    <Drawer
      isOpen={Boolean(activeDrawerAssetId)}
      onClose={() => {
        setActiveDrawerAssetId(null);
        setIsPreviewingInvoice(false);
      }}
      title={<span className="font-mono">{asset.tag}</span>}
      subtitle={asset.title}
      headerAction={
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
      }
      footer={
        <div className="w-full flex items-center justify-between gap-2">
          {asset.status === 'Assigned' ? (
            <button
              onClick={() => returnAssetToPool(asset.id)}
              className="px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 border border-gray-200 dark:border-gray-700 rounded-btn transition-colors"
            >
              Return to pool
            </button>
          ) : (
            <button
              onClick={() => openAssignModal({ assetId: asset.id })}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn transition-colors shadow-xs"
            >
              Assign to employee
            </button>
          )}

          <div className="flex items-center gap-2">
            {asset.status !== 'In repair' && (
              <button
                onClick={() => markAssetInRepair(asset.id)}
                className="px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 rounded-btn transition-colors"
              >
                Send to repair
              </button>
            )}

            {asset.status !== 'Retired' && (
              <button
                onClick={() => retireAsset(asset.id)}
                className="px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-btn transition-colors"
              >
                Retire
              </button>
            )}
          </div>
        </div>
      }
    >
      {/* Drawer Subtabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 pb-2 -mt-2">
        {(['overview', 'history', 'documents'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium capitalize border-b-2 -mb-2.5 transition-all ${
              activeTab === tab
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-5 pt-2">
          {/* Assigned Person Card */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200/80 dark:border-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-2">
              Assignment Details
            </span>
            {asset.assignedToName ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                    {asset.assignedToAvatar || asset.assignedToName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {asset.assignedToName}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {asset.assignedToDepartment} · {asset.assignmentCategory || 'Permanent'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openAssignModal({ assetId: asset.id })}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Currently in unassigned pool (Available)</span>
                <button
                  onClick={() => openAssignModal({ assetId: asset.id })}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-btn hover:bg-indigo-700"
                >
                  Deploy
                </button>
              </div>
            )}
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Vendor */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/70 dark:border-gray-700">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <Building className="w-3.5 h-3.5" />
                <span>Vendor</span>
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {asset.vendor}
              </div>
            </div>

            {/* Product Family (Editable) */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/70 dark:border-gray-700">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <Laptop className="w-3.5 h-3.5" />
                <span>Product Family</span>
              </div>
              <select
                value={asset.family}
                onChange={(e) =>
                  inlineUpdateAsset(asset.id, { family: e.target.value as ProductFamily })
                }
                className="w-full text-xs font-semibold text-gray-900 dark:text-white bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
              >
                <option value="Mac">Mac</option>
                <option value="Windows">Windows</option>
                <option value="Monitor">Monitor</option>
                <option value="Other">Other (Uncategorized)</option>
              </select>
            </div>

            {/* Purchase Date */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/70 dark:border-gray-700">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Purchase Date</span>
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatDisplayDate(asset.purchaseDate)}
              </div>
            </div>

            {/* Purchase Price */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/70 dark:border-gray-700">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Cost / Price</span>
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatINR(asset.price)}
              </div>
            </div>
          </div>

          {/* Warranty Card */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/70 dark:border-gray-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Hardware Warranty ({asset.warrantyMonths} Months)</span>
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${warranty.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${warranty.dotClass}`} />
                <span>{warranty.label}</span>
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              Coverage active until{' '}
              <strong className="text-gray-900 dark:text-white">
                {formatDisplayDate(asset.warrantyEnd)}
              </strong>
            </div>
          </div>

          {/* Hardware Configuration */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/70 dark:border-gray-700 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Specification & Hardware Configuration</span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200/60 dark:border-gray-800">
              {asset.configuration}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: History (Vertical Timeline) */}
      {activeTab === 'history' && (
        <div className="space-y-4 pt-2">
          <div className="text-xs text-gray-500 mb-2 font-medium">
            Lifecycle & Maintenance Audit Trail
          </div>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
            {asset.history.map((entry) => (
              <div key={entry.id} className="relative group">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-900 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {entry.action}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatDisplayDate(entry.date)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    By <span className="font-medium text-gray-700 dark:text-gray-300">{entry.actor}</span>
                  </div>
                  {entry.details && (
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 p-2 rounded-lg border border-gray-200/60 dark:border-gray-700">
                      {entry.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Documents */}
      {activeTab === 'documents' && (
        <div className="space-y-4 pt-2">
          <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-gray-900 dark:text-white">
                  Invoice_{asset.tag}.pdf
                </h5>
                <p className="text-[11px] text-gray-400">
                  PDF document · 148 KB · Verified
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPreviewingInvoice(!isPreviewingInvoice)}
                className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 rounded-md hover:bg-white dark:hover:bg-gray-700"
                title="Preview invoice"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  addToast({
                    title: 'Downloading Invoice',
                    message: `Invoice_${asset.tag}.pdf download started`,
                    type: 'info',
                  })
                }
                className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 rounded-md hover:bg-white dark:hover:bg-gray-700"
                title="Download invoice"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isPreviewingInvoice && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 text-xs space-y-2 animate-in fade-in">
              <div className="flex justify-between border-b pb-2">
                <span className="font-bold">INVOICE: INV-2024-883</span>
                <span>Date: {formatDisplayDate(asset.purchaseDate)}</span>
              </div>
              <div>Vendor: {asset.vendor}</div>
              <div>Item: {asset.title} ({asset.tag})</div>
              <div>Amount: {formatINR(asset.price)}</div>
              <div className="text-emerald-600 flex items-center gap-1 font-semibold pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Paid via Corporate Wire</span>
              </div>
            </div>
          )}

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-white dark:bg-gray-800/40">
            <UploadCloud className="w-7 h-7 text-gray-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Upload replacement invoice or warranty document
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Supports PDF, PNG, JPG up to 10MB
            </p>
          </div>
        </div>
      )}
    </Drawer>
  );
};
