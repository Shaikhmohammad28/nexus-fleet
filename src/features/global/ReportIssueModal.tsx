import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Modal } from '../../components/Modal';
import { MessageSquarePlus, UploadCloud, CheckCircle2, Send, FileImage, X } from 'lucide-react';

export const ReportIssueModal: React.FC = () => {
  const {
    isReportIssueOpen,
    setReportIssueOpen,
    addToast,
  } = useStore();

  const [issueType, setIssueType] = useState<'Bug' | 'Idea' | 'Question'>('Bug');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState<{ name: string; size: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addToast({
      title: 'Feedback submitted',
      message: `Your ${issueType.toLowerCase()} ticket has been logged for internal IT operations.`,
      type: 'success',
    });

    setDescription('');
    setScreenshot(null);
    setReportIssueOpen(false);
  };

  return (
    <>
      {/* Right Edge Fixed Vertical Red Tab */}
      <button
        onClick={() => setReportIssueOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-3 px-1.5 rounded-l-xl shadow-lg transition-all transform hover:-translate-x-1 flex flex-col items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-red-400 select-none cursor-pointer"
        aria-label="Report Issue"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span>Report Issue</span>
      </button>

      {/* Modal Dialog */}
      <Modal
        isOpen={isReportIssueOpen}
        onClose={() => setReportIssueOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-red-600" />
            <span>Report an Issue or Feedback</span>
          </div>
        }
        subtitle="Submit defect reports, feature enhancements, or questions to IT admin"
        maxWidth="md"
        footer={
          <>
            <button
              onClick={() => setReportIssueOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 rounded-btn transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!description.trim()}
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-btn shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Send Ticket</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Issue Type Chips */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category*
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Bug', 'Idea', 'Question'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setIssueType(t)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    issueType === t
                      ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800 ring-1 ring-red-400'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Description*
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What went wrong or what enhancement would you like to see?"
              className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Screenshot Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Optional Screenshot or Attachment
            </label>
            {screenshot ? (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {screenshot.name}
                  </span>
                  <span className="text-gray-400">({screenshot.size})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setScreenshot(null)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() =>
                  setScreenshot({
                    name: 'screenshot_error_triage.png',
                    size: '420 KB',
                  })
                }
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center hover:border-red-400 cursor-pointer bg-white dark:bg-gray-800/40 transition-colors"
              >
                <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <span className="text-gray-600 dark:text-gray-300 block">
                  Click to attach diagnostic screenshot
                </span>
                <span className="text-[10px] text-gray-400">PNG, JPG up to 5MB</span>
              </div>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};
