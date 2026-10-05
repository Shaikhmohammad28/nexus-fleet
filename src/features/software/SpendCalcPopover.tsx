import React from 'react';
import { Modal } from '../../components/Modal';
import { HelpCircle, Calculator, CheckCircle2 } from 'lucide-react';

interface SpendCalcPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpendCalcPopover: React.FC<SpendCalcPopoverProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>How Software Metrics are Calculated</span>
        </div>
      }
      subtitle="Transparent accounting and seat allocation formulas"
      maxWidth="md"
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn transition-colors"
        >
          Got it
        </button>
      }
    >
      <div className="space-y-4 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
        <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1.5">
          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Monthly Spend (Prorated)</span>
          </div>
          <p>
            Sum of prorated monthly costs for all Active and Trial subscriptions overlapping the selected month. Yearly subscriptions are divided by 12. Flat plans count their fixed monthly charges.
          </p>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1.5">
          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Seat Utilization (Inclusive of Flat Plans)</span>
          </div>
          <p>
            Total assigned users across all active platforms divided by total paid license capacity. Flat plans (like Figma and Zoom) are included by counting their active assigned users against their team seat limit, eliminating false 0.01% artifacts.
          </p>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1.5">
          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Avg Cost / Employee</span>
          </div>
          <p>
            Calculated as total monthly SaaS spend divided by current company headcount (40 full-time employees).
          </p>
        </div>
      </div>
    </Modal>
  );
};
