import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { NotificationCategory, NotificationItem } from '../../types';
import {
  Bell,
  CheckCheck,
  Sliders,
  ShieldAlert,
  Clock,
  Package,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const NotificationsPopover: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    setFilterWarranty,
    setSearchQuery,
    setSoftwareSearchQuery,
    setActiveKpiFilter,
    setStockAlertSettingsOpen,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('All');
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (activeCategory === 'All') return true;
    return n.category === activeCategory;
  });

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationRead(notif.id);
    setIsOpen(false);

    if (notif.targetTab) {
      setActiveTab(notif.targetTab);
    }

    if (notif.filterAction) {
      const { type, payload } = notif.filterAction;
      if (type === 'warranty') {
        setFilterWarranty(payload);
      } else if (type === 'lowStock') {
        setActiveKpiFilter(`low-stock-${payload}`);
      } else if (type === 'search') {
        if (notif.targetTab === 'software') {
          setSoftwareSearchQuery(payload);
        } else {
          setSearchQuery(payload);
        }
      } else if (type === 'joiner') {
        // Handled by tab switch
      }
    }
  };

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'Warranty':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'Renewals':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Stock':
        return <Package className="w-4 h-4 text-red-500" />;
      default:
        return <Layers className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Button with badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex border-b border-gray-100 dark:border-gray-800 px-3 bg-gray-50/50 dark:bg-gray-900/40 text-xs">
            {(['All', 'Warranty', 'Renewals', 'Stock'] as NotificationCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-2 px-3 font-medium border-b-2 -mb-px transition-all ${
                  activeCategory === cat
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List Body */}
          <div className="overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 flex-1">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No notifications in this category.
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    !notif.read
                      ? 'bg-indigo-50/30 dark:bg-indigo-950/20 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 shrink-0 mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h5 className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                        {notif.title}
                      </h5>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer with Stock Alert Settings link */}
          <div className="p-3 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setIsOpen(false);
                setStockAlertSettingsOpen(true);
              }}
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Stock alert settings</span>
            </button>
            <span className="text-[11px] text-gray-400">Inventory Alerting Engine</span>
          </div>
        </div>
      )}
    </div>
  );
};
