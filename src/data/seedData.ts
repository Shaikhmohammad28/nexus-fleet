import { HardwareAsset, Employee, NewJoiner, SoftwareSubscription, NotificationItem } from '../types';
import { addDays, subDays, format, formatDistanceToNow } from 'date-fns';

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Laxman Meena', email: 'laxman.meena@nexuscorp.internal', department: 'Engineering', role: 'Staff Frontend Engineer', avatar: 'LM' },
  { id: 'emp-2', name: 'Meet Shah', email: 'meet.shah@nexuscorp.internal', department: 'Design', role: 'Lead Product Designer', avatar: 'MS' },
  { id: 'emp-3', name: 'Mike Veilleux', email: 'mike.v@nexuscorp.internal', department: 'Sales', role: 'VP Global Sales', avatar: 'MV' },
  { id: 'emp-4', name: 'Pratik Bhatt', email: 'pratik.b@nexuscorp.internal', department: 'Engineering', role: 'Principal Architect', avatar: 'PB' },
  { id: 'emp-5', name: 'Priya Sharma', email: 'priya.s@nexuscorp.internal', department: 'Product', role: 'Group Product Manager', avatar: 'PS' },
  { id: 'emp-6', name: 'Ananya Roy', email: 'ananya.roy@nexuscorp.internal', department: 'Design', role: 'Senior UX Researcher', avatar: 'AR' },
  { id: 'emp-7', name: 'Rohit Verma', email: 'rohit.v@nexuscorp.internal', department: 'Engineering', role: 'DevOps Lead', avatar: 'RV' },
  { id: 'emp-8', name: 'Sneha Patel', email: 'sneha.p@nexuscorp.internal', department: 'HR', role: 'Head of People Operations', avatar: 'SP' },
  { id: 'emp-9', name: 'Arjun Nair', email: 'arjun.nair@nexuscorp.internal', department: 'Finance', role: 'Financial Controller', avatar: 'AN' },
  { id: 'emp-10', name: 'Divya Iyer', email: 'divya.i@nexuscorp.internal', department: 'Engineering', role: 'Senior Backend Engineer', avatar: 'DI' },
  { id: 'emp-11', name: 'Karan Malhotra', email: 'karan.m@nexuscorp.internal', department: 'Sales', role: 'Enterprise Account Exec', avatar: 'KM' },
  { id: 'emp-12', name: 'Tanvi Joshi', email: 'tanvi.j@nexuscorp.internal', department: 'HR', role: 'Technical Recruiter', avatar: 'TJ' },
  { id: 'emp-13', name: 'Aditya Rao', email: 'aditya.r@nexuscorp.internal', department: 'Engineering', role: 'Security Engineer', avatar: 'AR' },
  { id: 'emp-14', name: 'Meera Nambiar', email: 'meera.n@nexuscorp.internal', department: 'Design', role: 'Brand & Visual Designer', avatar: 'MN' },
  { id: 'emp-15', name: 'Vikram Seth', email: 'vikram.seth@nexuscorp.internal', department: 'Operations', role: 'IT Operations Specialist', avatar: 'VS' },
  { id: 'emp-16', name: 'Shreya Das', email: 'shreya.d@nexuscorp.internal', department: 'Product', role: 'Technical Product Manager', avatar: 'SD' },
  { id: 'emp-17', name: 'Gaurav Sen', email: 'gaurav.s@nexuscorp.internal', department: 'Engineering', role: 'Data Platform Engineer', avatar: 'GS' },
  { id: 'emp-18', name: 'Neha Chawla', email: 'neha.c@nexuscorp.internal', department: 'Finance', role: 'Senior Accountant', avatar: 'NC' },
  { id: 'emp-19', name: 'Rahul Deshmukh', email: 'rahul.d@nexuscorp.internal', department: 'Sales', role: 'Solutions Architect', avatar: 'RD' },
  { id: 'emp-20', name: 'Ritu Kapoor', email: 'ritu.k@nexuscorp.internal', department: 'HR', role: 'People Partner', avatar: 'RK' },
  { id: 'emp-21', name: 'Kavita Menon', email: 'kavita.m@nexuscorp.internal', department: 'Engineering', role: 'QA Automation Lead', avatar: 'KM' },
  { id: 'emp-22', name: 'Nikhil Saxena', email: 'nikhil.s@nexuscorp.internal', department: 'Engineering', role: 'Mobile iOS Engineer', avatar: 'NS' },
  { id: 'emp-23', name: 'Pooja Hegde', email: 'pooja.h@nexuscorp.internal', department: 'Design', role: 'Design System Lead', avatar: 'PH' },
  { id: 'emp-24', name: 'Siddharth Jain', email: 'siddharth.j@nexuscorp.internal', department: 'Sales', role: 'Customer Success Lead', avatar: 'SJ' },
  { id: 'emp-25', name: 'Alok Gupta', email: 'alok.g@nexuscorp.internal', department: 'Engineering', role: 'Machine Learning Specialist', avatar: 'AG' },
  { id: 'emp-26', name: 'Bhavna Kulkarni', email: 'bhavna.k@nexuscorp.internal', department: 'Operations', role: 'Procurement Specialist', avatar: 'BK' },
  { id: 'emp-27', name: 'Chetan Bhagat', email: 'chetan.b@nexuscorp.internal', department: 'Product', role: 'Growth PM', avatar: 'CB' },
  { id: 'emp-28', name: 'Deepa Mishra', email: 'deepa.m@nexuscorp.internal', department: 'Finance', role: 'FP&A Analyst', avatar: 'DM' },
  { id: 'emp-29', name: 'Farhan Akhtar', email: 'farhan.a@nexuscorp.internal', department: 'Design', role: 'Motion Designer', avatar: 'FA' },
  { id: 'emp-30', name: 'Harsh Vardhan', email: 'harsh.v@nexuscorp.internal', department: 'Engineering', role: 'Cloud Infrastructure Eng', avatar: 'HV' },
  { id: 'emp-31', name: 'Ishita Dutta', email: 'ishita.d@nexuscorp.internal', department: 'HR', role: 'HR Operations Lead', avatar: 'ID' },
  { id: 'emp-32', name: 'Jaspreet Singh', email: 'jaspreet.s@nexuscorp.internal', department: 'Sales', role: 'Sales Development Rep', avatar: 'JS' },
  { id: 'emp-33', name: 'Kunal Nayyar', email: 'kunal.n@nexuscorp.internal', department: 'Engineering', role: 'Full Stack Engineer', avatar: 'KN' },
  { id: 'emp-34', name: 'Lavanya Reddy', email: 'lavanya.r@nexuscorp.internal', department: 'Product', role: 'Associate PM', avatar: 'LR' },
  { id: 'emp-35', name: 'Manish Tiwari', email: 'manish.t@nexuscorp.internal', department: 'Engineering', role: 'Frontend Engineer', avatar: 'MT' },
  { id: 'emp-36', name: 'Nandini Sen', email: 'nandini.s@nexuscorp.internal', department: 'Design', role: 'UI Designer', avatar: 'NS' },
  { id: 'emp-37', name: 'Omkar Naik', email: 'omkar.n@nexuscorp.internal', department: 'Operations', role: 'Workplace Coordinator', avatar: 'ON' },
  { id: 'emp-38', name: 'Pallavi Joshi', email: 'pallavi.j@nexuscorp.internal', department: 'Engineering', role: 'Site Reliability Engineer', avatar: 'PJ' },
  { id: 'emp-39', name: 'Rohan Bose', email: 'rohan.b@nexuscorp.internal', department: 'Sales', role: 'Account Executive', avatar: 'RB' },
  { id: 'emp-40', name: 'Sunil Gavaskar', email: 'sunil.g@nexuscorp.internal', department: 'Engineering', role: 'Distinguished Engineer', avatar: 'SG' },
];

export const VENDORS = [
  'Alpha Tech Solutions',
  'Apple Authorized Reseller',
  'Dell India',
  'Lenovo India',
  'Amazon Business',
];

const MAC_TITLES = [
  'MacBook Pro 13"',
  'MacBook Pro (14-inch, Nov 2023)',
  'MacBook Air M2',
  'MacBook Pro 16" M3 Max',
  'MacBook Air 15" M2',
];

const WIN_TITLES = [
  'Dell Latitude 5440',
  'Lenovo ThinkPad E14',
  'Dell XPS 15 9530',
  'Lenovo ThinkPad T14 Gen 4',
  'Dell Precision 3580',
];

const MON_TITLES = [
  'Dell 24" Monitor P2422H',
  'LG 27" UltraFine 4K',
  'Dell UltraSharp 27" U2723QE',
  'LG 34" UltraWide Curved Monitor',
];

// Seed generator for 251 assets
export function generateSeedAssets(): HardwareAsset[] {
  const assets: HardwareAsset[] = [];
  const today = new Date();

  // Exactly 251 assets:
  // 213 Assigned, 38 Unassigned (Available) = 251.
  // Family initial distribution:
  // Other (uncategorized): 247
  // Windows: 3
  // Mac: 1
  // Monitor: 0
  //
  // Titles distribution:
  // 121 Mac titles (MacBook)
  // 88 Windows titles (Dell/Lenovo/ThinkPad)
  // 42 Monitor titles (Dell Monitor / LG UltraFine)
  // Total = 121 + 88 + 42 = 251.

  // Distribute assigned vs unassigned across items:
  // We need exactly 213 Assigned and 38 Available.
  // We will assign indices 0..212 as Assigned, and 213..250 as Available!
  // To keep low stock visible before auto-categorize or by family:
  // Mac: 1 initial, Windows: 3 initial, Monitor: 0 initial, Other: 247 initial.
  // Specifically:
  // One Mac asset has family 'Mac' and is in Unassigned stock! So Mac has "1 left" Available!
  // 3 Windows assets have family 'Windows' and are Unassigned! So Windows has "3 left" Available!
  // All other 247 assets have family 'Other'!

  for (let i = 1; i <= 251; i++) {
    let title: string;
    let vendor: string;
    let tagPrefix: string;
    let initialFamily: 'Mac' | 'Windows' | 'Monitor' | 'Other' = 'Other';
    let config: string;
    let basePrice: number;

    // Deterministic item title selection
    if (i <= 121) {
      // Mac
      title = MAC_TITLES[(i - 1) % MAC_TITLES.length];
      vendor = (i % 2 === 0) ? 'Apple Authorized Reseller' : 'Alpha Tech Solutions';
      tagPrefix = 'NEX-MAC';
      config = i % 3 === 0 ? 'M3 Pro, 18GB Unified Memory, 512GB SSD' : (i % 3 === 1 ? 'M2 chip, 16GB RAM, 256GB SSD' : 'M3 Max, 36GB RAM, 1TB SSD');
      basePrice = i % 2 === 0 ? 149900 : 199900;
    } else if (i <= 209) {
      // Windows
      title = WIN_TITLES[(i - 122) % WIN_TITLES.length];
      vendor = (i % 2 === 0) ? 'Dell India' : 'Lenovo India';
      tagPrefix = 'NEX-WIN';
      config = i % 2 === 0 ? 'Intel Core i7-1365U, 16GB DDR5, 512GB SSD' : 'Intel Core i5-1335U, 16GB RAM, 512GB SSD';
      basePrice = 85000 + ((i * 350) % 30000);
    } else {
      // Monitor
      title = MON_TITLES[(i - 210) % MON_TITLES.length];
      vendor = (i % 2 === 0) ? 'Amazon Business' : 'Dell India';
      tagPrefix = 'NEX-MON';
      config = i % 2 === 0 ? '24-inch FHD IPS, HDMI, DP, USB-C Hub 65W' : '27-inch 4K UHD IPS, Thunderbolt 3 94W PD';
      basePrice = 24500 + ((i * 400) % 25000);
    }

    // Set initial 4 explicitly categorized items to match problem description:
    // Windows: 3, Mac: 1, Monitor: 0, Other: 247
    if (i === 214) {
      initialFamily = 'Mac'; // This will be unassigned -> Mac: 1 left!
    } else if (i === 215 || i === 216 || i === 217) {
      initialFamily = 'Windows'; // These will be unassigned -> Windows: 3 left!
    } else {
      initialFamily = 'Other';
    }

    const tag = `${tagPrefix}-${String(i).padStart(2, '0')}`;
    const isAssigned = i <= 213;
    const status: 'Available' | 'Assigned' = isAssigned ? 'Assigned' : 'Available';

    // Assign to one of the 40 employees if assigned
    const employee = isAssigned ? INITIAL_EMPLOYEES[(i - 1) % INITIAL_EMPLOYEES.length] : null;
    const assignmentCategories: ('Permanent' | 'Temporary' | 'Shared')[] = ['Permanent', 'Permanent', 'Permanent', 'Temporary', 'Shared'];
    const assignmentCategory = isAssigned ? assignmentCategories[(i - 1) % assignmentCategories.length] : null;

    // Warranty calculation:
    // ~12 expire within 30 days (e.g. days +3 to +28)
    // ~8 already expired (e.g. days -45 to -5)
    // Rest are active: 31-90 days, or >90 days (1-3 years out)
    let warrantyEndDate: Date;
    let purchaseDate = format(subDays(today, 365 + (i * 7) % 500), 'yyyy-MM-dd');
    let warrantyMonths = (i % 3 === 0) ? 36 : 24;

    if (i >= 15 && i <= 26) {
      // 12 expiring in 30 days
      const daysLeft = 3 + ((i - 15) * 2);
      warrantyEndDate = addDays(today, daysLeft);
    } else if (i >= 27 && i <= 34) {
      // 8 already expired
      const daysAgo = 5 + ((i - 27) * 6);
      warrantyEndDate = subDays(today, daysAgo);
    } else if (i >= 35 && i <= 55) {
      // 31 - 90 days
      const daysLeft = 35 + ((i - 35) * 2);
      warrantyEndDate = addDays(today, daysLeft);
    } else {
      // > 90 days
      const daysLeft = 120 + ((i * 13) % 600);
      warrantyEndDate = addDays(today, daysLeft);
    }

    const history = [
      {
        id: `hist-${i}-1`,
        date: purchaseDate,
        action: 'Added to stock',
        actor: 'Procurement Bot',
        details: `Procured from ${vendor} under Invoice INV-${2023000 + i}`,
      },
    ];

    if (isAssigned && employee) {
      history.push({
        id: `hist-${i}-2`,
        date: format(subDays(today, (i * 3) % 200 + 10), 'yyyy-MM-dd'),
        action: `Assigned to ${employee.name}`,
        actor: 'Admin (Pratik Bhatt)',
        details: `${assignmentCategory} deployment for ${employee.department} department`,
      });
    }

    assets.push({
      id: `asset-${i}`,
      tag,
      title,
      vendor,
      family: initialFamily,
      assignedTo: employee ? employee.id : null,
      assignedToName: employee ? employee.name : undefined,
      assignedToAvatar: employee ? employee.avatar : undefined,
      assignedToDepartment: employee ? employee.department : undefined,
      assignmentCategory,
      purchaseDate,
      price: basePrice,
      warrantyMonths,
      warrantyEnd: format(warrantyEndDate, 'yyyy-MM-dd'),
      configuration: config,
      invoice: true,
      status,
      history,
    });
  }

  return assets;
}

export const JOINER_NAMES = [
  { name: 'Kavya Raman', dept: 'Engineering', role: 'Frontend Engineer', days: 21, suggestedTag: 'NEX-MAC-214', title: 'MacBook Pro 14-inch' },
  { name: 'Sameer Sen', dept: 'Engineering', role: 'DevOps Engineer', days: 19, suggestedTag: 'NEX-WIN-215', title: 'Dell Latitude 5440' },
  { name: 'Aakash Verma', dept: 'Design', role: 'Product Designer', days: 17, suggestedTag: 'NEX-MAC-218', title: 'MacBook Air M2' },
  { name: 'Megha Nair', dept: 'Sales', role: 'Enterprise SDR', days: 15, suggestedTag: 'NEX-WIN-216', title: 'Lenovo ThinkPad E14' },
  { name: 'Rishi Kapoor', dept: 'Engineering', role: 'Backend Engineer', days: 14, suggestedTag: 'NEX-MAC-219', title: 'MacBook Pro 14-inch' },
  { name: 'Pooja Bhatt', dept: 'HR', role: 'Talent Acquisition', days: 12, suggestedTag: 'NEX-WIN-217', title: 'Dell Latitude 5440' },
  { name: 'Naveen Jindal', dept: 'Finance', role: 'Financial Analyst', days: 10, suggestedTag: 'NEX-WIN-220', title: 'Lenovo ThinkPad E14' },
  { name: 'Sanya Mirza', dept: 'Marketing', role: 'Content Strategist', days: 9, suggestedTag: 'NEX-MAC-221', title: 'MacBook Air 15" M2' },
  { name: 'Varun Dhawan', dept: 'Engineering', role: 'QA Engineer', days: 8, suggestedTag: 'NEX-WIN-222', title: 'Dell XPS 15 9530' },
  { name: 'Deepika Rao', dept: 'Design', role: 'Visual Designer', days: 7, suggestedTag: 'NEX-MAC-223', title: 'MacBook Pro (14-inch, Nov 2023)' },
  { name: 'Karthik Aryan', dept: 'Engineering', role: 'Mobile iOS Eng', days: 6, suggestedTag: 'NEX-MAC-224', title: 'MacBook Pro 14-inch' },
  { name: 'Tara Sutaria', dept: 'Sales', role: 'Account Exec', days: 5, suggestedTag: 'NEX-WIN-225', title: 'Dell Latitude 5440' },
  { name: 'Ishan Kishan', dept: 'Operations', role: 'Logistics Lead', days: 5, suggestedTag: 'NEX-WIN-226', title: 'Lenovo ThinkPad E14' },
  { name: 'Ananya Birla', dept: 'Finance', role: 'Treasury Analyst', days: 4, suggestedTag: 'NEX-WIN-227', title: 'Dell Latitude 5440' },
  { name: 'Zoya Akhtar', dept: 'Design', role: 'UX Writer', days: 3, suggestedTag: 'NEX-MAC-228', title: 'MacBook Air M2' },
  { name: 'Abhay Deol', dept: 'Engineering', role: 'Data Engineer', days: 3, suggestedTag: 'NEX-WIN-229', title: 'Dell XPS 15 9530' },
  { name: 'Dia Mirza', dept: 'HR', role: 'HR Generalist', days: 2, suggestedTag: 'NEX-WIN-230', title: 'Lenovo ThinkPad E14' },
  { name: 'Ranbir Sethi', dept: 'Product', role: 'Associate PM', days: 2, suggestedTag: 'NEX-MAC-231', title: 'MacBook Pro 14-inch' },
  { name: 'Kiara Advani', dept: 'Sales', role: 'BDR Specialist', days: 1, suggestedTag: 'NEX-WIN-232', title: 'Dell Latitude 5440' },
  { name: 'Manav Kaul', dept: 'Engineering', role: 'Site Reliability', days: 0, suggestedTag: 'NEX-MAC-233', title: 'MacBook Pro 16" M3 Max' },
];

export function generateSeedJoiners(): NewJoiner[] {
  const today = new Date();
  return JOINER_NAMES.map((j, idx) => {
    const initials = j.name.split(' ').map(n => n[0]).join('');
    return {
      id: `joiner-${idx + 1}`,
      name: j.name,
      department: j.dept,
      role: j.role,
      avatar: initials,
      joinedDaysAgo: j.days,
      joinedDate: format(subDays(today, j.days), 'yyyy-MM-dd'),
      overdue: j.days > 7,
      suggestedAssetId: `asset-${214 + (idx % 37)}`,
      suggestedAssetTitle: j.title,
      suggestedAssetTag: j.suggestedTag,
    };
  }).sort((a, b) => b.joinedDaysAgo - a.joinedDaysAgo); // Oldest first
}

export function generateSeedSubscriptions(): SoftwareSubscription[] {
  const today = new Date();
  return [
    {
      id: 'sub-1',
      name: 'Cursor',
      provider: 'Anysphere Inc.',
      providerUrl: 'https://cursor.com',
      description: 'AI-first Code Editor built for software engineering productivity.',
      ownerId: 'emp-1',
      ownerName: 'Laxman Meena',
      department: 'Engineering',
      type: 'Seat based',
      amount: 40.00, // 2 seats * $20.00
      billingCycle: 'Monthly',
      pricePerSeat: 20.00,
      totalSeats: 2,
      assignedUsers: ['emp-1', 'emp-4'], // 2 assigned users
      startDate: '2024-01-09',
      renewalDay: 9,
      nextRenewalDate: format(addDays(today, 6), 'yyyy-MM-dd'),
      autoRenew: true,
      remindDaysBefore: 7,
      notifyOwner: true,
      notifyFinance: true,
      status: 'Active',
      billingHistory: [
        { id: 'b-c-1', date: '2026-08-09', amount: 40.00, status: 'Paid', invoiceNumber: 'INV-CUR-901' },
        { id: 'b-c-2', date: '2026-07-09', amount: 40.00, status: 'Paid', invoiceNumber: 'INV-CUR-801' },
        { id: 'b-c-3', date: '2026-06-09', amount: 40.00, status: 'Paid', invoiceNumber: 'INV-CUR-701' },
        { id: 'b-c-4', date: '2026-05-09', amount: 40.00, status: 'Paid', invoiceNumber: 'INV-CUR-601' },
        { id: 'b-c-5', date: '2026-04-09', amount: 40.00, status: 'Paid', invoiceNumber: 'INV-CUR-501' },
        { id: 'b-c-6', date: '2026-03-09', amount: 40.00, status: 'Paid', invoiceNumber: 'INV-CUR-401' },
      ],
      activity: [
        { id: 'act-1', date: '2026-08-09', description: 'Monthly auto-renewal processed ($40.00 USD)', user: 'Stripe Billing' },
        { id: 'act-2', date: '2026-07-15', description: 'Assigned seat to Pratik Bhatt', user: 'Laxman Meena' },
      ],
      notes: 'Tier 1 AI coding companion for core architecture team.'
    },
    {
      id: 'sub-2',
      name: 'Figma',
      provider: 'Figma Inc.',
      providerUrl: 'https://figma.com',
      description: 'Collaborative interface design tool and Design Systems repository.',
      ownerId: 'emp-2',
      ownerName: 'Meet Shah',
      department: 'Design',
      type: 'Flat',
      amount: 10.00,
      billingCycle: 'Monthly',
      totalSeats: 25,
      assignedUsers: ['emp-2', 'emp-6', 'emp-14', 'emp-23', 'emp-29', 'emp-36', 'emp-1', 'emp-3', 'emp-5', 'emp-7', 'emp-8', 'emp-9', 'emp-10', 'emp-11', 'emp-12', 'emp-13', 'emp-15', 'emp-16', 'emp-17', 'emp-18', 'emp-19'], // 21 assigned users
      startDate: '2023-05-01',
      renewalDay: 1,
      nextRenewalDate: format(addDays(today, 12), 'yyyy-MM-dd'),
      autoRenew: false,
      remindDaysBefore: 14,
      notifyOwner: true,
      notifyFinance: false,
      status: 'Active',
      billingHistory: [
        { id: 'b-f-1', date: '2026-09-01', amount: 10.00, status: 'Paid', invoiceNumber: 'INV-FIG-902' },
        { id: 'b-f-2', date: '2026-08-01', amount: 10.00, status: 'Paid', invoiceNumber: 'INV-FIG-802' },
        { id: 'b-f-3', date: '2026-07-01', amount: 10.00, status: 'Paid', invoiceNumber: 'INV-FIG-702' },
        { id: 'b-f-4', date: '2026-06-01', amount: 10.00, status: 'Paid', invoiceNumber: 'INV-FIG-602' },
        { id: 'b-f-5', date: '2026-05-01', amount: 10.00, status: 'Paid', invoiceNumber: 'INV-FIG-502' },
        { id: 'b-f-6', date: '2026-04-01', amount: 10.00, status: 'Paid', invoiceNumber: 'INV-FIG-402' },
      ],
      activity: [
        { id: 'act-f-1', date: '2026-09-01', description: 'Manual renewal confirmed by Meet Shah', user: 'Meet Shah' },
      ],
      notes: 'Company organization workspace for UX, product, and dev handoff.'
    },
    {
      id: 'sub-3',
      name: 'Slack',
      provider: 'Salesforce / Slack Technologies',
      providerUrl: 'https://slack.com',
      description: 'Enterprise team communication, asynchronous channels, and integrations.',
      ownerId: 'emp-8',
      ownerName: 'Sneha Patel',
      department: 'HR',
      type: 'Seat based',
      amount: 350.00, // 40 seats * $8.75
      billingCycle: 'Monthly',
      pricePerSeat: 8.75,
      totalSeats: 40,
      assignedUsers: INITIAL_EMPLOYEES.slice(0, 34).map(e => e.id), // 34 of 40 seats
      startDate: '2023-01-15',
      renewalDay: 15,
      nextRenewalDate: format(addDays(today, 18), 'yyyy-MM-dd'),
      autoRenew: true,
      remindDaysBefore: 7,
      notifyOwner: true,
      notifyFinance: true,
      status: 'Active',
      billingHistory: [
        { id: 'b-s-1', date: '2026-09-15', amount: 350.00, status: 'Paid', invoiceNumber: 'SLK-2026-09' },
        { id: 'b-s-2', date: '2026-08-15', amount: 350.00, status: 'Paid', invoiceNumber: 'SLK-2026-08' },
        { id: 'b-s-3', date: '2026-07-15', amount: 350.00, status: 'Paid', invoiceNumber: 'SLK-2026-07' },
        { id: 'b-s-4', date: '2026-06-15', amount: 350.00, status: 'Paid', invoiceNumber: 'SLK-2026-06' },
        { id: 'b-s-5', date: '2026-05-15', amount: 350.00, status: 'Paid', invoiceNumber: 'SLK-2026-05' },
        { id: 'b-s-6', date: '2026-04-15', amount: 350.00, status: 'Paid', invoiceNumber: 'SLK-2026-04' },
      ],
      activity: [
        { id: 'act-s-1', date: '2026-09-15', description: 'Monthly renewal executed', user: 'Slack Billing' },
      ],
      notes: 'Business+ tier workspace.'
    },
    {
      id: 'sub-4',
      name: 'Notion',
      provider: 'Notion Labs, Inc.',
      providerUrl: 'https://notion.so',
      description: 'Connected company wiki, roadmaps, engineering specs, and documentation.',
      ownerId: 'emp-5',
      ownerName: 'Priya Sharma',
      department: 'Product',
      type: 'Seat based',
      amount: 300.00, // 30 seats * $10
      billingCycle: 'Monthly',
      pricePerSeat: 10.00,
      totalSeats: 30,
      assignedUsers: INITIAL_EMPLOYEES.slice(0, 18).map(e => e.id), // 18 of 30 seats (12 unused!)
      startDate: '2023-04-22',
      renewalDay: 22,
      nextRenewalDate: format(addDays(today, 24), 'yyyy-MM-dd'),
      autoRenew: true,
      remindDaysBefore: 7,
      notifyOwner: true,
      notifyFinance: true,
      status: 'Active',
      billingHistory: [
        { id: 'b-n-1', date: '2026-08-22', amount: 300.00, status: 'Paid', invoiceNumber: 'NTN-8821' },
        { id: 'b-n-2', date: '2026-07-22', amount: 300.00, status: 'Paid', invoiceNumber: 'NTN-7732' },
        { id: 'b-n-3', date: '2026-06-22', amount: 300.00, status: 'Paid', invoiceNumber: 'NTN-6643' },
        { id: 'b-n-4', date: '2026-05-22', amount: 300.00, status: 'Paid', invoiceNumber: 'NTN-5554' },
        { id: 'b-n-5', date: '2026-04-22', amount: 300.00, status: 'Paid', invoiceNumber: 'NTN-4465' },
        { id: 'b-n-6', date: '2026-03-22', amount: 300.00, status: 'Paid', invoiceNumber: 'NTN-3376' },
      ],
      activity: [
        { id: 'act-n-1', date: '2026-08-22', description: 'Auto-renewal processed', user: 'Notion Bot' },
      ],
      notes: 'Enterprise Workspace with SAML SSO.'
    },
    {
      id: 'sub-5',
      name: 'GitHub Copilot',
      provider: 'GitHub, Inc.',
      providerUrl: 'https://github.com/features/copilot',
      description: 'AI pair programmer for pull requests, terminal, and IDE autocompletion.',
      ownerId: 'emp-4',
      ownerName: 'Pratik Bhatt',
      department: 'Engineering',
      type: 'Seat based',
      amount: 228.00, // 12 * $19
      billingCycle: 'Monthly',
      pricePerSeat: 19.00,
      totalSeats: 12,
      assignedUsers: INITIAL_EMPLOYEES.filter(e => e.department === 'Engineering').slice(0, 12).map(e => e.id), // 12 of 12 seats
      startDate: '2024-02-05',
      renewalDay: 5,
      nextRenewalDate: format(addDays(today, 8), 'yyyy-MM-dd'),
      autoRenew: true,
      remindDaysBefore: 3,
      notifyOwner: true,
      notifyFinance: true,
      status: 'Active',
      billingHistory: [
        { id: 'b-gh-1', date: '2026-09-05', amount: 228.00, status: 'Paid', invoiceNumber: 'GH-COP-905' },
        { id: 'b-gh-2', date: '2026-08-05', amount: 228.00, status: 'Paid', invoiceNumber: 'GH-COP-805' },
        { id: 'b-gh-3', date: '2026-07-05', amount: 228.00, status: 'Paid', invoiceNumber: 'GH-COP-705' },
        { id: 'b-gh-4', date: '2026-06-05', amount: 228.00, status: 'Paid', invoiceNumber: 'GH-COP-605' },
        { id: 'b-gh-5', date: '2026-05-05', amount: 228.00, status: 'Paid', invoiceNumber: 'GH-COP-505' },
        { id: 'b-gh-6', date: '2026-04-05', amount: 228.00, status: 'Paid', invoiceNumber: 'GH-COP-405' },
      ],
      activity: [
        { id: 'act-gh-1', date: '2026-09-05', description: 'Subscription auto-renewed ($228.00)', user: 'GitHub Org' },
      ],
      notes: 'GitHub Business seat tier.'
    },
    {
      id: 'sub-6',
      name: 'Zoom',
      provider: 'Zoom Video Communications',
      providerUrl: 'https://zoom.us',
      description: 'Company-wide video meetings, cloud recording, and webinar hosting.',
      ownerId: 'emp-15',
      ownerName: 'Vikram Seth',
      department: 'Operations',
      type: 'Flat',
      amount: 149.90,
      billingCycle: 'Yearly',
      totalSeats: 50,
      assignedUsers: INITIAL_EMPLOYEES.map(e => e.id), // 40 assigned users
      startDate: '2023-10-18',
      renewalDay: 18,
      nextRenewalDate: format(addDays(today, 20), 'yyyy-MM-dd'),
      autoRenew: false,
      remindDaysBefore: 30,
      notifyOwner: true,
      notifyFinance: true,
      status: 'Active',
      billingHistory: [
        { id: 'b-z-1', date: '2025-10-18', amount: 149.90, status: 'Paid', invoiceNumber: 'ZM-YR-2025' },
        { id: 'b-z-2', date: '2024-10-18', amount: 149.90, status: 'Paid', invoiceNumber: 'ZM-YR-2024' },
      ],
      activity: [
        { id: 'act-z-1', date: '2025-10-18', description: 'Yearly license renewal processed', user: 'Vikram Seth' },
      ],
      notes: 'Zoom Pro Annual plan with 500-attendee webinar add-on.'
    },
    {
      id: 'sub-7',
      name: 'Adobe Creative Cloud',
      provider: 'Adobe Inc.',
      providerUrl: 'https://adobe.com/creativecloud',
      description: 'Creative apps suite including Illustrator, After Effects, Photoshop, Premiere.',
      ownerId: 'emp-2',
      ownerName: 'Meet Shah',
      department: 'Design',
      type: 'Seat based',
      amount: 164.97, // 3 * $54.99
      billingCycle: 'Monthly',
      pricePerSeat: 54.99,
      totalSeats: 3,
      assignedUsers: ['emp-2', 'emp-14', 'emp-29'], // 3 seats
      startDate: format(subDays(today, 25), 'yyyy-MM-dd'),
      renewalDay: 28,
      nextRenewalDate: format(addDays(today, 5), 'yyyy-MM-dd'),
      autoRenew: false,
      remindDaysBefore: 5,
      notifyOwner: true,
      notifyFinance: false,
      status: 'Trial',
      trialEndsInDays: 5,
      billingHistory: [],
      activity: [
        { id: 'act-a-1', date: format(subDays(today, 25), 'yyyy-MM-dd'), description: 'Started 30-day Enterprise Trial (3 seats)', user: 'Meet Shah' },
      ],
      notes: 'Design team trial testing video workflow acceleration.'
    },
    {
      id: 'sub-8',
      name: 'Jira Software',
      provider: 'Atlassian Pty Ltd',
      providerUrl: 'https://atlassian.com/software/jira',
      description: 'Legacy agile sprint boards, issue tracking, and defect management.',
      ownerId: 'emp-7',
      ownerName: 'Rohit Verma',
      department: 'Engineering',
      type: 'Flat',
      amount: 120.00,
      billingCycle: 'Monthly',
      totalSeats: 30,
      assignedUsers: INITIAL_EMPLOYEES.slice(0, 25).map(e => e.id),
      startDate: '2022-03-10',
      renewalDay: 10,
      nextRenewalDate: '2026-10-10',
      autoRenew: false,
      status: 'Paused',
      billingHistory: [
        { id: 'b-j-1', date: '2026-07-10', amount: 120.00, status: 'Paid', invoiceNumber: 'ATL-JIR-701' },
        { id: 'b-j-2', date: '2026-06-10', amount: 120.00, status: 'Paid', invoiceNumber: 'ATL-JIR-601' },
      ],
      activity: [
        { id: 'act-j-1', date: '2026-08-01', description: 'Subscription paused pending migration to Linear', user: 'Rohit Verma' },
      ],
      notes: 'Paused during migration to Linear/GitHub Projects.'
    },
  ];
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '12 warranties expire within 30 days',
    message: 'Action needed: Review and request renewals or replacement quotes.',
    category: 'Warranty',
    timestamp: '10m ago',
    read: false,
    targetTab: 'hardware',
    filterAction: { type: 'warranty', payload: 'Expiring in 30 days' },
  },
  {
    id: 'notif-2',
    title: 'Adobe trial ends in 5 days',
    message: 'Adobe Creative Cloud (3 seats) trial expires soon. Convert to paid or cancel.',
    category: 'Renewals',
    timestamp: '25m ago',
    read: false,
    targetTab: 'software',
    filterAction: { type: 'search', payload: 'Adobe' },
  },
  {
    id: 'notif-3',
    title: 'Mac stock is low: 1 left',
    message: 'Available inventory is below the threshold of 3 units.',
    category: 'Stock',
    timestamp: '1h ago',
    read: false,
    targetTab: 'hardware',
    filterAction: { type: 'lowStock', payload: 'Mac' },
  },
  {
    id: 'notif-4',
    title: 'Laxman Meena has been waiting 9 days for a device',
    message: 'Overdue joiner onboarding alert for Engineering department.',
    category: 'Stock',
    timestamp: '2h ago',
    read: false,
    targetTab: 'hardware',
    filterAction: { type: 'joiner', payload: 'overdue' },
  },
  {
    id: 'notif-5',
    title: 'Figma renewal due in 12 days',
    message: 'Auto-renewal is disabled. Review license allocation before 1 Oct.',
    category: 'Renewals',
    timestamp: '3h ago',
    read: false,
    targetTab: 'software',
    filterAction: { type: 'search', payload: 'Figma' },
  },
  {
    id: 'notif-6',
    title: 'Windows stock is low: 3 left',
    message: 'Lenovo and Dell stock approaching reorder point.',
    category: 'Stock',
    timestamp: '5h ago',
    read: false,
    targetTab: 'hardware',
    filterAction: { type: 'lowStock', payload: 'Windows' },
  },
  {
    id: 'notif-7',
    title: '8 asset warranties have expired',
    message: 'Retired or legacy devices requiring service coverage review.',
    category: 'Warranty',
    timestamp: 'Yesterday',
    read: false,
    targetTab: 'hardware',
    filterAction: { type: 'warranty', payload: 'Expired' },
  },
  {
    id: 'notif-8',
    title: 'Unused seats alert: Notion',
    message: '12 of 30 seats are unassigned ($120.00/mo potential savings).',
    category: 'Renewals',
    timestamp: '1d ago',
    read: false,
    targetTab: 'software',
    filterAction: { type: 'search', payload: 'Notion' },
  },
  {
    id: 'notif-9',
    title: 'Cursor monthly renewal approaching',
    message: 'Upcoming charge $40.00 on 9 Oct via auto-renew.',
    category: 'Renewals',
    timestamp: '2d ago',
    read: false,
    targetTab: 'software',
    filterAction: { type: 'search', payload: 'Cursor' },
  },
  {
    id: 'notif-10',
    title: 'New joiners batch imported',
    message: '20 joiners require hardware provisioning this sprint.',
    category: 'All',
    timestamp: '3d ago',
    read: false,
    targetTab: 'hardware',
    filterAction: { type: 'joiner', payload: 'all' },
  },
];
