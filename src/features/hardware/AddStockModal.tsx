import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Modal } from '../../components/Modal';
import { ProductFamily, HardwareAsset } from '../../types';
import { VENDORS } from '../../data/seedData';
import { CsvImportModal } from './CsvImportModal';
import {
  PackagePlus,
  Plus,
  FileSpreadsheet,
  FileText,
  X,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { formatINR, formatDisplayDate } from '../../utils/formatters';

export const AddStockModal: React.FC = () => {
  const {
    isAddStockModalOpen,
    setAddStockModalOpen,
    assets,
    addAssets,
  } = useStore();

  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);

  // Form fields
  const [vendor, setVendor] = useState<string>('Apple Authorized Reseller');
  const [customVendor, setCustomVendor] = useState<string>('');
  const [isAddingNewVendor, setIsAddingNewVendor] = useState(false);

  const [title, setTitle] = useState<string>('MacBook Pro (14-inch, Nov 2023)');
  const [family, setFamily] = useState<ProductFamily>('Mac');
  const [customFamily, setCustomFamily] = useState<string>('');
  const [isCreatingFamily, setIsCreatingFamily] = useState(false);

  const [purchaseDate, setPurchaseDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [price, setPrice] = useState<number>(149900);
  const [quantity, setQuantity] = useState<number>(1);
  const [warrantyMonths, setWarrantyMonths] = useState<number>(24);
  const [configuration, setConfiguration] = useState<string>('Apple M3 Pro, 18GB Unified Memory, 512GB SSD');

  // Tag prefix
  const [tagPrefix, setTagPrefix] = useState<string>('NEX-MAC');

  // Invoice upload mock
  const [invoiceFile, setInvoiceFile] = useState<{ name: string; size: string; progress: number } | null>({
    name: 'Hardware_Procurement_Invoice_2026.pdf',
    size: '1.4 MB',
    progress: 100,
  });

  // Calculate next start index
  const nextStartIndex = useMemo(() => {
    return assets.length + 1;
  }, [assets.length]);

  // Warranty end date
  const warrantyEndDate = useMemo(() => {
    try {
      const pDate = new Date(purchaseDate);
      return addMonths(pDate, warrantyMonths);
    } catch {
      return addMonths(new Date(), 24);
    }
  }, [purchaseDate, warrantyMonths]);

  // Quick configuration tags
  const quickConfigChips = [
    '16GB RAM',
    '32GB RAM',
    '512GB SSD',
    '1TB SSD',
    'Apple M3 chip',
    'Intel Core i7-1365U',
    '4K UHD Display',
  ];

  const handleAddConfigChip = (chip: string) => {
    if (!configuration.includes(chip)) {
      setConfiguration(configuration ? `${configuration}, ${chip}` : chip);
    }
  };

  // Validation
  const effectiveVendor = isAddingNewVendor ? customVendor.trim() : vendor;
  const isVendorValid = effectiveVendor.length > 0;
  const isTitleValid = title.trim().length > 0;
  const isPriceValid = price > 0;
  const isQuantityValid = quantity >= 1;
  const isConfigValid = configuration.trim().length > 0;

  const isFormValid = isVendorValid && isTitleValid && isPriceValid && isQuantityValid && isConfigValid;

  const handleSubmit = (addAnother = false) => {
    if (!isFormValid) return;

    const newItems: Omit<HardwareAsset, 'id'>[] = [];
    for (let i = 0; i < quantity; i++) {
      const tagNumber = nextStartIndex + i;
      const tag = `${tagPrefix}-${String(tagNumber).padStart(2, '0')}`;

      newItems.push({
        tag,
        title: title.trim(),
        vendor: effectiveVendor,
        family,
        assignedTo: null,
        assignmentCategory: null,
        purchaseDate,
        price,
        warrantyMonths,
        warrantyEnd: format(warrantyEndDate, 'yyyy-MM-dd'),
        configuration: configuration.trim(),
        invoice: Boolean(invoiceFile),
        status: 'Available',
        history: [],
      });
    }

    addAssets(newItems);

    if (addAnother) {
      // Reset form but retain vendor as required
      setTitle('');
      setPrice(85000);
      setQuantity(1);
      setConfiguration('');
    } else {
      setAddStockModalOpen(false);
    }
  };

  if (!isAddStockModalOpen) return null;

  return (
    <>
      <Modal
        isOpen={isAddStockModalOpen}
        onClose={() => setAddStockModalOpen(false)}
        title={
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-2">
              <PackagePlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>+ Add Inventory Stock</span>
            </div>
            <button
              onClick={() => setIsCsvImportOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Import from CSV</span>
            </button>
          </div>
        }
        subtitle="Provision single or batch hardware stock directly into the Available pool"
        maxWidth="4xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-gray-500">
              * Required fields. Added assets highlight in indigo for 3 seconds.
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setAddStockModalOpen(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-btn transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!isFormValid}
                onClick={() => handleSubmit(true)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 rounded-btn transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit & add another
              </button>
              <button
                type="button"
                disabled={!isFormValid}
                onClick={() => handleSubmit(false)}
                className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500"
              >
                Submit ({quantity} assets)
              </button>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Columns (Form Inputs) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Vendor & Title Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Vendor */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Vendor Name*
                </label>
                {!isAddingNewVendor ? (
                  <div className="space-y-1">
                    <select
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                    >
                      {VENDORS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewVendor(true)}
                      className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add new vendor
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g. Redington India"
                      value={customVendor}
                      onChange={(e) => setCustomVendor(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsAddingNewVendor(false)}
                      className="p-1.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {!isVendorValid && (
                  <p className="text-[11px] text-red-500 mt-1">Vendor is required</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Hardware Model / Title*
                </label>
                <input
                  type="text"
                  placeholder="e.g. MacBook Pro 14-inch M3 Pro"
                  value={title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTitle(val);
                    // Smart family auto-selection
                    const lower = val.toLowerCase();
                    if (lower.includes('mac') || lower.includes('apple')) {
                      setFamily('Mac');
                      setTagPrefix('NEX-MAC');
                    } else if (lower.includes('dell') || lower.includes('lenovo') || lower.includes('thinkpad')) {
                      setFamily('Windows');
                      setTagPrefix('NEX-WIN');
                    } else if (lower.includes('monitor') || lower.includes('display')) {
                      setFamily('Monitor');
                      setTagPrefix('NEX-MON');
                    }
                  }}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                />
                {!isTitleValid && (
                  <p className="text-[11px] text-red-500 mt-1">Title is required</p>
                )}
              </div>
            </div>

            {/* Product Family & Purchase Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Product Family*
                </label>
                <select
                  value={family}
                  onChange={(e) => {
                    const fam = e.target.value as ProductFamily;
                    setFamily(fam);
                    if (fam === 'Mac') setTagPrefix('NEX-MAC');
                    else if (fam === 'Windows') setTagPrefix('NEX-WIN');
                    else if (fam === 'Monitor') setTagPrefix('NEX-MON');
                    else setTagPrefix('NEX-AST');
                  }}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Mac">Mac</option>
                  <option value="Windows">Windows</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Purchase Date*</span>
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Price & Quantity & Warranty Months */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Price / Piece (INR)*
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-semibold text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {!isPriceValid && (
                  <p className="text-[11px] text-red-500 mt-1">Price must be &gt; 0</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Quantity (Units)*
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Warranty Period*
                </label>
                <div className="flex items-center gap-1.5">
                  {[12, 24, 36].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWarrantyMonths(m)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        warrantyMonths === m
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hardware Configurations Textarea & Quick Add Chips */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Hardware Specifications & Configurations*
                </label>
                <span className="text-[11px] text-gray-400">Click chips to append</span>
              </div>
              <textarea
                rows={2}
                value={configuration}
                onChange={(e) => setConfiguration(e.target.value)}
                placeholder="e.g. 16GB Unified RAM, 512GB SSD, M3 Pro 12-core CPU..."
                className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500 mb-2 font-mono"
              />
              <div className="flex flex-wrap gap-1.5">
                {quickConfigChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleAddConfigChip(chip)}
                    className="px-2 py-0.5 text-[11px] bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 rounded-md border border-gray-200 dark:border-gray-700 transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Invoice Drag & Drop PDF Chip */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Upload Purchase Invoice (PDF)
              </label>
              {invoiceFile ? (
                <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="font-semibold text-indigo-950 dark:text-indigo-200">
                        {invoiceFile.name}
                      </div>
                      <div className="text-[11px] text-indigo-700 dark:text-indigo-400">
                        {invoiceFile.size} · Upload 100% complete
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInvoiceFile(null)}
                    className="p-1 text-indigo-700 hover:text-red-600"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() =>
                    setInvoiceFile({
                      name: `Invoice_${title.replace(/\s+/g, '_')}_2026.pdf`,
                      size: '1.2 MB',
                      progress: 100,
                    })
                  }
                  className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-3.5 text-center hover:border-indigo-500 cursor-pointer bg-white dark:bg-gray-800 transition-colors"
                >
                  <p className="text-xs text-gray-500">
                    Click to attach procurement invoice PDF
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Summary Card */}
          <div className="bg-gray-50/80 dark:bg-gray-900/40 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Live Batch Summary</span>
              </div>

              {/* Total Cost */}
              <div>
                <span className="text-[11px] text-gray-500 block">Total Procurement Cost</span>
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {formatINR(quantity * price)}
                </div>
                <div className="text-[11px] text-gray-400">
                  {quantity} units × {formatINR(price)}
                </div>
              </div>

              {/* Tag Range Preview (Editable Prefix) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-gray-500">Asset Tag Prefix</span>
                  <input
                    type="text"
                    value={tagPrefix}
                    onChange={(e) => setTagPrefix(e.target.value.toUpperCase())}
                    className="px-2 py-0.5 text-xs font-mono font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-right w-28 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-900 dark:text-white">
                  {quantity === 1
                    ? `${tagPrefix}-${String(nextStartIndex).padStart(2, '0')}`
                    : `${tagPrefix}-${String(nextStartIndex).padStart(2, '0')} to ${tagPrefix}-${String(
                        nextStartIndex + quantity - 1
                      ).padStart(2, '0')}`}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Sequentially indexed from existing catalog
                </p>
              </div>

              {/* Warranty End Date */}
              <div>
                <span className="text-[11px] text-gray-500 block">Warranty Active Until</span>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatDisplayDate(format(warrantyEndDate, 'yyyy-MM-dd'))}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">
                  {warrantyMonths} months manufacturer coverage
                </span>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/80 text-[11px] text-indigo-900 dark:text-indigo-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Immediately provisioned into <strong>Available</strong> unassigned inventory stock.
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Csv Import Submodal */}
      <CsvImportModal
        isOpen={isCsvImportOpen}
        onClose={() => setIsCsvImportOpen(false)}
      />
    </>
  );
};
