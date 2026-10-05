export type ProductFamily = 'Mac' | 'Windows' | 'Monitor' | 'Other';

export type AssetStatus = 'Available' | 'Assigned' | 'In repair' | 'Retired';

export type AssignmentCategory = 'Permanent' | 'Temporary' | 'Shared';

export interface AssetHistoryEntry {
  id: string;
  date: string;
  action: string;
  actor: string;
  details?: string;
}

export interface HardwareAsset {
  id: string;
  tag: string;
  title: string;
  vendor: string;
  family: ProductFamily;
  assignedTo: string | null; // Employee ID or name
  assignedToName?: string;
  assignedToAvatar?: string;
  assignedToDepartment?: string;
  assignmentCategory: AssignmentCategory | null;
  temporaryReturnDate?: string;
  purchaseDate: string;
  price: number; // in INR
  warrantyMonths: number;
  warrantyEnd: string; // ISO date string
  configuration: string;
  invoice: boolean;
  status: AssetStatus;
  history: AssetHistoryEntry[];
  isHighlighted?: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: 'Engineering' | 'Design' | 'Sales' | 'HR' | 'Finance' | 'Product' | 'Operations';
  avatar: string;
  role: string;
}

export interface NewJoiner {
  id: string;
  name: string;
  department: string;
  role: string;
  avatar: string;
  joinedDaysAgo: number;
  joinedDate: string;
  overdue: boolean; // joinedDaysAgo > 7
  suggestedAssetId: string;
  suggestedAssetTitle: string;
  suggestedAssetTag: string;
}

export type SubscriptionType = 'Flat' | 'Seat based';
export type BillingCycle = 'Monthly' | 'Quarterly' | 'Yearly';
export type SubscriptionStatus = 'Active' | 'Trial' | 'Paused' | 'Expired' | 'Cancelled';

export interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  invoiceNumber: string;
}

export interface SubscriptionActivity {
  id: string;
  date: string;
  description: string;
  user: string;
}

export interface SoftwareSubscription {
  id: string;
  name: string;
  provider: string;
  providerUrl: string;
  description: string;
  ownerId: string;
  ownerName: string;
  department: string;
  type: SubscriptionType;
  amount: number; // in USD
  billingCycle: BillingCycle;
  pricePerSeat?: number;
  totalSeats?: number;
  assignedUsers: string[]; // employee IDs
  startDate: string;
  endDate?: string;
  renewalDay: number; // 1-31
  nextRenewalDate: string;
  autoRenew: boolean;
  remindDaysBefore?: number;
  notifyOwner?: boolean;
  notifyFinance?: boolean;
  status: SubscriptionStatus;
  trialEndsInDays?: number;
  notes?: string;
  billingHistory: BillingRecord[];
  activity: SubscriptionActivity[];
}

export type NotificationCategory = 'All' | 'Warranty' | 'Renewals' | 'Stock';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
  targetTab?: 'hardware' | 'software';
  filterAction?: {
    type: string;
    payload?: any;
  };
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'danger';
  duration?: number;
  undoAction?: () => void;
}

export type TableDensity = 'Comfortable' | 'Compact';

export type GroupByOption = 'None' | 'Title' | 'Product Family' | 'Vendor' | 'Availability/Status' | 'Assigned/Unassigned';

export interface SavedView {
  id: string;
  name: string;
  filters: {
    family?: ProductFamily | 'All';
    pool?: string;
    warranty?: string;
    search?: string;
    missingFamily?: boolean;
  };
}
