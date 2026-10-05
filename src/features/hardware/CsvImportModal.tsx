import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Modal } from '../../components/Modal';
import { UploadCloud, CheckCircle2, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose }) => {
  const { addAssets } = useStore();
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [fileName, setFileName] = useState<string>('hardware_bulk_import_24.csv');

  const mockRows = [
    { tag: 'NEX-MAC-252', title: 'MacBook Pro 14-inch M3', vendor: 'Apple Authorized Reseller', family: 'Mac' as const, price: 199900, valid: true },
    { tag: 'NEX-MAC-253', title: 'MacBook Pro 14-inch M3', vendor: 'Apple Authorized Reseller', family: 'Mac' as const, price: 199900, valid: true },
    { tag: 'NEX-WIN-254', title: 'Dell Latitude 5440 i7', vendor: 'Dell India', family: 'Windows' as const, price: 92000, valid: true },
    { tag: 'NEX-WIN-255', title: 'Lenovo ThinkPad E14 Gen 5', vendor: 'Lenovo India', family: 'Windows' as const, price: 84000, valid: true },
    { tag: 'NEX-MON-256', title: 'Dell 24" Monitor P2422H', vendor: 'Amazon Business', family: 'Monitor' as const, price: 21500, valid: true },
    { tag: 'NEX-MAC-257', title: 'MacBook Air 15" M2', vendor: 'Alpha Tech Solutions', family: 'Mac' as const, price: 134900, valid: true },
  ];

  const handleConfirmImport = () => {
    // Generate 24 rows modeled after preview
    const fullImport = Array.from({ length: 24 }, (_, i) => {
      const idx = i + 1;
      const isMac = idx % 2 === 0;
      return {
        tag: isMac ? `NEX-MAC-${252 + i}` : `NEX-WIN-${252 + i}`,
        title: isMac ? 'MacBook Pro 14-inch M3' : 'Dell Latitude 5440 i7',
        vendor: isMac ? 'Apple Authorized Reseller' : 'Dell India',
        family: isMac ? ('Mac' as const) : ('Windows' as const),
        assignedTo: null,
        assignmentCategory: null,
        purchaseDate: new Date().toISOString().slice(0, 10),
        price: isMac ? 199900 : 92000,
        warrantyMonths: 24,
        warrantyEnd: new Date(Date.now() + 730 * 86400000).toISOString().slice(0, 10),
        configuration: '16GB Unified RAM, 512GB SSD',
        invoice: true,
        status: 'Available' as const,
        history: [],
      };
    });

    addAssets(fullImport);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Hardware Assets from CSV"
      subtitle="Upload or verify batch hardware provisioning manifest"
      maxWidth="xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-btn transition-colors"
          >
            Cancel
          </button>
          {step === 'upload' ? (
            <button
              onClick={() => setStep('preview')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn transition-colors shadow-sm"
            >
              <span>Continue to Preview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConfirmImport}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Import 24 rows</span>
            </button>
          )}
        </>
      }
    >
      {step === 'upload' ? (
        <div className="space-y-4">
          <div
            onClick={() => setStep('preview')}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center hover:border-indigo-500 cursor-pointer bg-gray-50/50 dark:bg-gray-800/40 transition-colors"
          >
            <UploadCloud className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Drag & drop CSV spreadsheet here, or browse files
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supports CSV with Tag, Title, Vendor, Price, WarrantyEnd headers
            </p>
          </div>

          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold">{fileName}</span>
              <span className="text-indigo-700 dark:text-indigo-400">(24 rows ready)</span>
            </div>
            <button
              onClick={() => setStep('preview')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Quick Preview
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              Validating 24 records found in {fileName}
            </span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              All 24 rows passed schema validation
            </span>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-500">
                <tr>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Tag</th>
                  <th className="p-2.5">Title</th>
                  <th className="p-2.5">Vendor</th>
                  <th className="p-2.5">Family</th>
                  <th className="p-2.5">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {mockRows.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </td>
                    <td className="p-2.5 font-mono font-medium">{r.tag}</td>
                    <td className="p-2.5">{r.title}</td>
                    <td className="p-2.5 text-gray-500">{r.vendor}</td>
                    <td className="p-2.5 font-semibold text-indigo-600">{r.family}</td>
                    <td className="p-2.5">{formatINR(r.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  );
};
