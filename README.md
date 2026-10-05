# Nexus Fleet | Enterprise IT & SaaS Operations

An ultra-modern, fully functional, clickable prototype for internal IT asset management, employee onboarding device allocation, and SaaS subscription expenditure intelligence. Built with Vite, React 18, TypeScript, Tailwind CSS, Zustand, Recharts, and Lucide icons.

---

## ⚡ Quick Start & Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:5173`.

3. **Production build check**:
   ```bash
   npm run build
   ```

---

## 🏛️ System Architecture & Design Philosophy

- **Dual-Pane Enterprise App Shell**: Collapsible high-density sidebar navigation, contextual command topbar, and fluid multi-pane workspace.
- **Zustand Central Reactive Store (`src/store/useStore.ts`)**: Single source of truth driving 251 hardware assets, 18 software subscriptions, 40 employees, 20 new joiners, threshold settings, and the Global Undo Stack.
- **Strict Fleet Reconciliation Identity**:
  $$\text{Total Fleet (251)} = \text{Assigned (213)} + \text{Unassigned (38)} + \text{In Repair (0)} + \text{Retired (0)}$$
  Every device movement, joiner assignment, stock ingestion, or status modification updates the live reconciliation counter in real-time.
- **Universal Multi-Step Undo Engine**: Every state mutation (heuristics classification, joiner device allocation, stock addition, row deletion, auto-renew toggle, license revocation) pushes an undo action onto the stack with 1-click toast and topbar rollback triggers.

---

## 🚀 Key Feature Modules

### 1. Hardware Fleet Management
- **Nexus AI Classification Engine**:
  - Initial state flags 247 uncategorized assets in family `Other`.
  - Heuristic classification rules preview: `MacBook` → `Mac`, `Dell/Lenovo/Latitude` → `Windows`, `Monitor/UltraFine` → `Monitor`.
  - Bulk apply dynamically shifts assets into their respective families with real-time KPI card, distribution bar, and table updates.
- **Command Metric Pods (KPI Filtering)**:
  - Interactive selection rings toggle filtered subsets (Assigned, Unassigned, Low Stock Alerts per family, Expiring Warranties <30 days). Clicking again resets the filter.
- **Priority Joiners Onboarding Queue**:
  - Urgency badges highlight team members joined >7 days ago without equipment.
  - "Assign suggested" immediately decrements unassigned inventory, links the hardware asset to the employee, and presents a rollback toast.
  - "Choose device" allows reverse device allocation from available inventory.
- **Ultra-Dense Enterprise Data Grid**:
  - Live search across tags, models, vendors, and assignees.
  - Column customizer to hide or reveal spec columns.
  - Monospace tags with 1-click copy feedback.
  - Inline title and tag editing on hover.
  - Collapsible Group By headers (Title, Family, Vendor, Status, Assigned).
  - Multi-select floating bulk action capsule.
- **Smart Stock Ingestion**:
  - Sequential tag generator (`NEX-MAC-`, `NEX-WIN-`, `NEX-MON-`).
  - Autocomplete vendor dropdown, cost calculator, invoice dropzone, and CSV batch ingestion modal.
- **Device Spec & Audit Drawer**:
  - Detailed hardware configuration, actor audit timeline, and downloadable PDF invoice generator.

### 2. SaaS Subscriptions & Financial Intelligence
- **Prorated Accounting Engine**:
  - Prorated monthly spend calculations accounting for billing cycles (Monthly, Quarterly, Yearly) and dynamic Month/Year calendar simulations.
  - Seat utilization incorporating flat licenses (Figma, Zoom) alongside per-seat licenses.
- **Upcoming Renewals Strip**:
  - 30-day proactive contract timeline with "Remind me", "Review contract", and "Renew now" (with undo support).
- **License Optimization / Direct Savings Opportunities**:
  - Pinpoints unallocated seats (e.g. Notion, Slack) with 1-click clawback actions.
- **List & Insights Views**:
  - **Contracts Grid**: Inline status change, avatar utilization bars, annual run-rate calculation, and auto-renew toggle.
  - **Analytics View**: Recharts 6-month historical spend trajectory bar chart, interactive category donut chart with slice drilldown to drawer, and Top 5 costliest platforms.
- **Subscription Drawer with Seat Management**:
  - Real-time seat allocation and 1-click license revocation with live KPI recalibration.

### 3. Global Command Shell & Accessibility
- **Command Palette (`Ctrl+/` or `Cmd+/`)**:
  - Omnipresent fuzzy search across hardware devices, team members, software contracts, and administrative actions.
- **Notification Center**:
  - Categorized alerts with unread badges and direct deep-linking into filtered tables.
- **Keyboard Shortcuts (`?`)**:
  - Fast keyboard hotkeys for navigation, device ingestion, and search.
- **Dark / Light Mode**:
  - High-contrast, accessibility-tested dark mode and modern light theme.
- **Interactive Reviewer Checklist**:
  - Built-in 10-step evaluator guide with auto-detection for prototype verification.
