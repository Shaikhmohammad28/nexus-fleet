import { format, differenceInDays, parseISO, isPast } from 'date-fns';

export function formatINR(val: number): string {
  if (isNaN(val)) return '₹0';
  const parts = val.toString().split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedWhole = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `₹${formattedWhole}${parts[1] ? '.' + parts[1] : ''}`;
}

export function formatUSD(val: number): string {
  if (isNaN(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatDisplayDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    return format(d, 'd MMM yyyy');
  } catch {
    return dateStr;
  }
}

export function getWarrantyStatus(warrantyEndStr: string) {
  try {
    const end = parseISO(warrantyEndStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isPast(end) && differenceInDays(today, end) > 0) {
      return {
        label: 'Expired',
        detail: `Expired ${differenceInDays(today, end)}d ago`,
        color: 'gray',
        badgeClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
        dotClass: 'bg-gray-400',
        daysLeft: -differenceInDays(today, end),
        isExpiring30: false,
        isExpired: true,
      };
    }

    const daysLeft = differenceInDays(end, today);
    if (daysLeft <= 30) {
      return {
        label: daysLeft === 0 ? 'Expires today' : `in ${daysLeft} days`,
        detail: `Expires in ${daysLeft}d`,
        color: 'red',
        badgeClass: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-800/60',
        dotClass: 'bg-red-500 animate-pulse',
        daysLeft,
        isExpiring30: true,
        isExpired: false,
      };
    } else if (daysLeft <= 90) {
      return {
        label: `in ${daysLeft} days`,
        detail: `Expires in ${daysLeft}d`,
        color: 'amber',
        badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
        dotClass: 'bg-amber-500',
        daysLeft,
        isExpiring30: false,
        isExpired: false,
      };
    } else {
      return {
        label: `in ${daysLeft} days`,
        detail: `Expires in ${daysLeft}d`,
        color: 'green',
        badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
        dotClass: 'bg-emerald-500',
        daysLeft,
        isExpiring30: false,
        isExpired: false,
      };
    }
  } catch {
    return {
      label: 'Unknown',
      detail: 'Invalid date',
      color: 'gray',
      badgeClass: 'bg-gray-100 text-gray-700',
      dotClass: 'bg-gray-400',
      daysLeft: 999,
      isExpiring30: false,
      isExpired: false,
    };
  }
}

export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const content = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
