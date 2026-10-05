import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Modal } from '../../components/Modal';
import {
  SubscriptionType,
  BillingCycle,
  SoftwareSubscription,
} from '../../types';
import {
  Sparkles,
  CreditCard,
  Calendar,
  BellRing,
  Layers,
  Building,
  User,
  CheckCircle2,
} from 'lucide-react';
import { format, addMonths, parseISO } from 'date-fns';
import { formatUSD, formatDisplayDate } from '../../utils/formatters';

interface TemplateOption {
  name: string;
  provider: string;
  url: string;
  type: SubscriptionType;
  pricePerSeat?: number;
  flatAmount?: number;
  cycle: BillingCycle;
  desc: string;
}

const TEMPLATES: TemplateOption[] = [
  { name: 'Figma', provider: 'Figma Inc.', url: 'https://figma.com', type: 'Flat', flatAmount: 15.00, cycle: 'Monthly', desc: 'Collaborative cloud interface design.' },
  { name: 'Slack', provider: 'Salesforce', url: 'https://slack.com', type: 'Seat based', pricePerSeat: 8.75, cycle: 'Monthly', desc: 'Real-time team messaging.' },
  { name: 'Notion', provider: 'Notion Labs', url: 'https://notion.so', type: 'Seat based', pricePerSeat: 10.00, cycle: 'Monthly', desc: 'Team workspace and documents.' },
  { name: 'GitHub Copilot', provider: 'GitHub Inc.', url: 'https://github.com', type: 'Seat based', pricePerSeat: 19.00, cycle: 'Monthly', desc: 'AI developer companion.' },
  { name: 'Zoom', provider: 'Zoom Video', url: 'https://zoom.us', type: 'Flat', flatAmount: 149.90, cycle: 'Yearly', desc: 'Video conferencing and webinars.' },
  { name: 'Google Workspace', provider: 'Google LLC', url: 'https://workspace.google.com', type: 'Seat based', pricePerSeat: 12.00, cycle: 'Monthly', desc: 'Gmail, Drive, Docs cloud suite.' },
  { name: 'Adobe Creative Cloud', provider: 'Adobe Inc.', url: 'https://adobe.com', type: 'Seat based', pricePerSeat: 54.99, cycle: 'Monthly', desc: 'Creative production tools.' },
];

export const AddEditSubscriptionModal: React.FC = () => {
  const {
    isAddEditSubscriptionModalOpen,
    editingSubscriptionId,
    closeAddEditSubscriptionModal,
    subscriptions,
    employees,
    addSubscription,
    updateSubscription,
  } = useStore();

  const isEditing = Boolean(editingSubscriptionId);
  const editingSub = subscriptions.find((s) => s.id === editingSubscriptionId);

  // Form Fields
  const [name, setName] = useState('');
  const [providerUrl, setProviderUrl] = useState('');
  const [description, setDescription] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [department, setDepartment] = useState('Engineering');

  const [type, setType] = useState<SubscriptionType>('Seat based');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('Monthly');
  const [pricePerSeat, setPricePerSeat] = useState<number>(20.00);
  const [totalSeats, setTotalSeats] = useState<number>(5);
  const [flatAmount, setFlatAmount] = useState<number>(100.00);

  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('');
  const [renewalDay, setRenewalDay] = useState(new Date().getDate());

  const [autoRenew, setAutoRenew] = useState(true);
  const [remindDaysBefore, setRemindDaysBefore] = useState(7);
  const [notifyOwner, setNotifyOwner] = useState(true);
  const [notifyFinance, setNotifyFinance] = useState(true);

  // Populate form if editing
  useEffect(() => {
    if (editingSub) {
      setName(editingSub.name);
      setProviderUrl(editingSub.providerUrl);
      setDescription(editingSub.description);
      setOwnerId(editingSub.ownerId);
      setDepartment(editingSub.department);
      setType(editingSub.type);
      setBillingCycle(editingSub.billingCycle);
      if (editingSub.type === 'Seat based') {
        setPricePerSeat(editingSub.pricePerSeat || 20);
        setTotalSeats(editingSub.totalSeats || 5);
      } else {
        setFlatAmount(editingSub.amount);
      }
      setStartDate(editingSub.startDate);
      setEndDate(editingSub.endDate || '');
      setRenewalDay(editingSub.renewalDay);
      setAutoRenew(editingSub.autoRenew);
      setRemindDaysBefore(editingSub.remindDaysBefore || 7);
      setNotifyOwner(editingSub.notifyOwner ?? true);
      setNotifyFinance(editingSub.notifyFinance ?? true);
    } else {
      // Default reset
      setName('');
      setProviderUrl('');
      setDescription('');
      setOwnerId(employees[0]?.id || '');
      setDepartment('Engineering');
      setType('Seat based');
      setBillingCycle('Monthly');
      setPricePerSeat(20.00);
      setTotalSeats(5);
      setFlatAmount(100.00);
      const today = new Date();
      setStartDate(format(today, 'yyyy-MM-dd'));
      setEndDate('');
      setRenewalDay(today.getDate());
      setAutoRenew(true);
      setRemindDaysBefore(7);
    }
  }, [editingSub, isAddEditSubscriptionModalOpen, employees]);

  // Apply template
  const applyTemplate = (t: TemplateOption) => {
    setName(t.name);
    setProviderUrl(t.url);
    setDescription(t.desc);
    setType(t.type);
    setBillingCycle(t.cycle);
    if (t.type === 'Seat based') {
      setPricePerSeat(t.pricePerSeat || 15);
      setTotalSeats(10);
    } else {
      setFlatAmount(t.flatAmount || 50);
    }
  };

  // Computed Amount
  const computedAmount = useMemo(() => {
    if (type === 'Seat based') {
      return pricePerSeat * totalSeats;
    }
    return flatAmount;
  }, [type, pricePerSeat, totalSeats, flatAmount]);

  // Cost Preview
  const monthlyCost = useMemo(() => {
    if (billingCycle === 'Yearly') return computedAmount / 12;
    if (billingCycle === 'Quarterly') return computedAmount / 3;
    return computedAmount;
  }, [computedAmount, billingCycle]);

  const yearlyCost = useMemo(() => monthlyCost * 12, [monthlyCost]);

  const nextRenewalDate = useMemo(() => {
    try {
      const s = parseISO(startDate);
      const monthsToAdd = billingCycle === 'Yearly' ? 12 : billingCycle === 'Quarterly' ? 3 : 1;
      return format(addMonths(s, monthsToAdd), 'yyyy-MM-dd');
    } catch {
      return format(addMonths(new Date(), 1), 'yyyy-MM-dd');
    }
  }, [startDate, billingCycle]);

  // Form Validation
  const isNameValid = name.trim().length > 0;
  const isAmountValid = computedAmount > 0;
  const isOwnerValid = Boolean(ownerId);
  const isStartDateValid = Boolean(startDate);
  const isFormValid = isNameValid && isAmountValid && isOwnerValid && isStartDateValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const owner = employees.find((emp) => emp.id === ownerId);

    if (isEditing && editingSub) {
      updateSubscription(editingSub.id, {
        name: name.trim(),
        providerUrl: providerUrl.trim(),
        description: description.trim(),
        ownerId,
        ownerName: owner?.name || editingSub.ownerName,
        department,
        type,
        billingCycle,
        amount: computedAmount,
        pricePerSeat: type === 'Seat based' ? pricePerSeat : undefined,
        totalSeats: type === 'Seat based' ? totalSeats : undefined,
        startDate,
        endDate: endDate || undefined,
        renewalDay,
        nextRenewalDate,
        autoRenew,
        remindDaysBefore,
        notifyOwner,
        notifyFinance,
      });
    } else {
      addSubscription({
        name: name.trim(),
        provider: name.trim() + ' Inc.',
        providerUrl: providerUrl.trim() || 'https://example.com',
        description: description.trim(),
        ownerId,
        ownerName: owner?.name || 'Admin',
        department,
        type,
        amount: computedAmount,
        billingCycle,
        pricePerSeat: type === 'Seat based' ? pricePerSeat : undefined,
        totalSeats: type === 'Seat based' ? totalSeats : undefined,
        assignedUsers: [ownerId],
        startDate,
        endDate: endDate || undefined,
        renewalDay,
        nextRenewalDate,
        autoRenew,
        remindDaysBefore,
        notifyOwner,
        notifyFinance,
        status: 'Active',
      });
    }

    closeAddEditSubscriptionModal();
  };

  if (!isAddEditSubscriptionModalOpen) return null;

  return (
    <Modal
      isOpen={isAddEditSubscriptionModalOpen}
      onClose={closeAddEditSubscriptionModal}
      title={isEditing ? `Edit Subscription: ${editingSub?.name}` : '+ Add Software Subscription'}
      subtitle={
        isEditing
          ? 'Update license terms, renewal preferences, and seat capacity'
          : 'Create a new software contract or start with a preconfigured vendor template'
      }
      maxWidth="4xl"
      footer={
        <div className="w-full flex items-center justify-between">
          <div className="text-xs text-gray-400">* Required fields</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeAddEditSubscriptionModal}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 rounded-btn transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!isFormValid}
              onClick={handleSubmit}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-btn shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500"
            >
              {isEditing ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Form Cards */}
        <div className="lg:col-span-2 space-y-5">
          {/* Templates Section */}
          {!isEditing && (
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200/80 dark:border-indigo-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Start from a vendor template</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => applyTemplate(t)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-gray-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 border border-gray-200 dark:border-gray-700 transition-colors shadow-xs"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="p-4 bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Basic Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Figma Enterprise"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Provider Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://figma.com"
                  value={providerUrl}
                  onChange={(e) => setProviderUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Product design and prototyping organization workspace"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>Contract Owner*</span>
                </label>
                <select
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-gray-400" />
                  <span>Department</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                >
                  {['Engineering', 'Design', 'Sales', 'Product', 'HR', 'Finance', 'Operations'].map(
                    (d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Billing */}
          <div className="p-4 bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Pricing & Billing Structure</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Subscription Type*
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Seat based', 'Flat'] as SubscriptionType[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setType(st)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        type === st
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                          : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Billing Cycle*
                </label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>

            {/* If Seat based, show Price per seat and Total seats */}
            {type === 'Seat based' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Price per seat (USD)*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-semibold text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      min="0.5"
                      step="0.01"
                      value={pricePerSeat}
                      onChange={(e) => setPricePerSeat(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Total Seats / Licenses*
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Fixed Plan Amount (USD)*
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-semibold text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={flatAmount}
                    onChange={(e) => setFlatAmount(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Duration & Auto Renewal */}
          <div className="p-4 bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Subscription Duration & Auto-Renewal</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Start Date*
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    try {
                      setRenewalDay(new Date(e.target.value).getDate());
                    } catch {}
                  }}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Renewal Day (1-31)*
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={renewalDay}
                  onChange={(e) => setRenewalDay(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-input focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Auto Renewal Toggle */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white block">
                    Automatic Renewal
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Vendor will charge corporate card automatically upon billing date
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoRenew(!autoRenew)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    autoRenew ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      autoRenew ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {autoRenew && (
                <div className="mt-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-lg space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-900 dark:text-indigo-200 font-medium">
                    <BellRing className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Send Reminder Alert:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[7, 14, 30].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setRemindDaysBefore(d)}
                        className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
                          remindDaysBefore === d
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {d} days before
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-1 text-xs text-gray-600 dark:text-gray-300">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyOwner}
                        onChange={(e) => setNotifyOwner(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Notify Contract Owner</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyFinance}
                        onChange={(e) => setNotifyFinance(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Notify Finance Team</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Cost Preview Card */}
        <div className="bg-gray-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Live Cost Preview</span>
            </div>

            {/* Monthly Cost */}
            <div>
              <span className="text-[11px] text-gray-500 block">Monthly Equivalent Spend</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {formatUSD(monthlyCost)} / mo
              </div>
              <div className="text-[11px] text-gray-400">
                {type === 'Seat based'
                  ? `${totalSeats} seats × ${formatUSD(pricePerSeat)}`
                  : `Flat ${billingCycle.toLowerCase()} charge`}
              </div>
            </div>

            {/* Yearly Cost */}
            <div>
              <span className="text-[11px] text-gray-500 block">Annualized Run-Rate</span>
              <div className="text-base font-bold text-gray-900 dark:text-white">
                {formatUSD(yearlyCost)} / year
              </div>
            </div>

            {/* Next Renewal */}
            <div>
              <span className="text-[11px] text-gray-500 block">Next Scheduled Renewal</span>
              <div className="text-xs font-semibold text-gray-900 dark:text-white">
                {formatDisplayDate(nextRenewalDate)}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">
                Cycle: {billingCycle}
              </span>
            </div>
          </div>

          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              Real-time update applies across all spending KPIs, graphs, and utilization metrics upon saving.
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
