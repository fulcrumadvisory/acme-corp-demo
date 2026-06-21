/* ============================================================
   Acme Defense Corp — Shared Data Layer
   localStorage-backed mock data for demo purposes
   ============================================================ */

const DB = {
  // ── Keys ──────────────────────────────────────────────────
  KEYS: {
    events:        'adc_events',
    registrations: 'adc_registrations',
    qa:            'adc_qa',
    polls:         'adc_polls',
    checkins:      'adc_checkins',
    news:          'adc_news',
    budget:        'adc_budget',
  },

  // ── Seed once ─────────────────────────────────────────────
  seedIfEmpty() {
    if (!localStorage.getItem(this.KEYS.events)) {
      localStorage.setItem(this.KEYS.events, JSON.stringify(SEED_EVENTS));
    }
    if (!localStorage.getItem(this.KEYS.registrations)) {
      localStorage.setItem(this.KEYS.registrations, JSON.stringify(SEED_REGISTRATIONS));
    }
    if (!localStorage.getItem(this.KEYS.qa)) {
      localStorage.setItem(this.KEYS.qa, JSON.stringify(SEED_QA));
    }
    if (!localStorage.getItem(this.KEYS.polls)) {
      localStorage.setItem(this.KEYS.polls, JSON.stringify(SEED_POLLS));
    }
    if (!localStorage.getItem(this.KEYS.checkins)) {
      localStorage.setItem(this.KEYS.checkins, JSON.stringify(SEED_CHECKINS));
    }
    if (!localStorage.getItem(this.KEYS.news)) {
      localStorage.setItem(this.KEYS.news, JSON.stringify(SEED_NEWS));
    }
    if (!localStorage.getItem(this.KEYS.budget)) {
      localStorage.setItem(this.KEYS.budget, JSON.stringify(SEED_BUDGET));
    }
  },

  // ── Getters ───────────────────────────────────────────────
  getEvents()        { try { return JSON.parse(localStorage.getItem(this.KEYS.events))        || []; } catch { return []; } },
  getRegistrations() { try { return JSON.parse(localStorage.getItem(this.KEYS.registrations)) || []; } catch { return []; } },
  getQA()            { try { return JSON.parse(localStorage.getItem(this.KEYS.qa))            || []; } catch { return []; } },
  getPolls()         { try { return JSON.parse(localStorage.getItem(this.KEYS.polls))         || []; } catch { return []; } },
  getCheckins()      { try { return JSON.parse(localStorage.getItem(this.KEYS.checkins))      || []; } catch { return []; } },
  getNews()          { try { return JSON.parse(localStorage.getItem(this.KEYS.news))          || []; } catch { return []; } },
  getBudget()        { try { return JSON.parse(localStorage.getItem(this.KEYS.budget))        || {}; } catch { return {}; } },

  // ── Setters ───────────────────────────────────────────────
  saveEvents(v)        { localStorage.setItem(this.KEYS.events,        JSON.stringify(v)); },
  saveRegistrations(v) { localStorage.setItem(this.KEYS.registrations, JSON.stringify(v)); },
  saveQA(v)            { localStorage.setItem(this.KEYS.qa,            JSON.stringify(v)); },
  savePolls(v)         { localStorage.setItem(this.KEYS.polls,         JSON.stringify(v)); },
  saveCheckins(v)      { localStorage.setItem(this.KEYS.checkins,      JSON.stringify(v)); },
  saveNews(v)          { localStorage.setItem(this.KEYS.news,          JSON.stringify(v)); },
  saveBudget(v)        { localStorage.setItem(this.KEYS.budget,        JSON.stringify(v)); },

  // ── Reset (demo helper) ───────────────────────────────────
  reset() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
    this.seedIfEmpty();
  },

  // ── Helpers ───────────────────────────────────────────────
  nextId(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.floor(Math.random() * 9000 + 1000);
  },

  getRegistrationsForEvent(eventId) {
    return this.getRegistrations().filter(r => r.eventId === eventId);
  },

  getCheckinsForEvent(eventId) {
    return this.getCheckins().filter(c => c.eventId === eventId);
  },

  getQAForEvent(eventId) {
    return this.getQA().filter(q => q.eventId === eventId);
  },

  getPollForEvent(eventId) {
    return this.getPolls().find(p => p.eventId === eventId) || null;
  },
};

// ── Utilities ─────────────────────────────────────────────────
function escH(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtDate(d, opts) {
  if (!d) return '—';
  try {
    const dt = new Date(d + (d.includes('T') ? '' : 'T12:00:00'));
    return dt.toLocaleDateString('en-US', opts || { month:'short', day:'numeric', year:'numeric' });
  } catch { return d; }
}

function fmtDateShort(d) {
  return fmtDate(d, { month:'short', day:'numeric' });
}

function fmtDateFull(d) {
  return fmtDate(d, { weekday:'long', month:'long', day:'numeric', year:'numeric' });
}

function fmtMoney(cents) {
  if (cents == null) return '—';
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function daysDiff(dateStr) {
  if (!dateStr) return null;
  const t = new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00'));
  return Math.round((t - new Date()) / 86400000);
}

function getMonthYear(dateStr) {
  if (!dateStr) return '—';
  return fmtDate(dateStr, { month:'short', year:'numeric' });
}

function eventStatus(ev) {
  if (!ev.date) return 'upcoming';
  const now = new Date();
  const start = new Date(ev.date + 'T' + (ev.startTime || '00:00'));
  const endDate = ev.endDate || ev.date;
  const end   = new Date(endDate + 'T' + (ev.endTime || '23:59'));
  if (now < start) return ev.published ? 'upcoming' : 'draft';
  if (now > end)   return 'past';
  return 'live';
}

function showToast(msg, duration) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration || 2800);
}

// ── SEED DATA ──────────────────────────────────────────────────

const SEED_EVENTS = [
  {
    id: 'evt_001',
    title: 'Q2 All-Hands Town Hall',
    category: 'All-Hands',
    date: '2026-07-15',
    endDate: '2026-07-15',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Building A Auditorium · Room 1A-100',
    virtualLink: 'https://teams.microsoft.com',
    capacity: 300,
    description: 'Join executive leadership for our Q2 Town Hall. We\'ll cover financial performance, program updates across FOCI and CMMC divisions, upcoming contract actions, and open Q&A with the leadership team. Lunch provided for in-person attendees.',
    agenda: [
      { time: '10:00 AM', title: 'Welcome & Opening Remarks', speaker: 'CEO — James Hartley', duration: '10 min' },
      { time: '10:10 AM', title: 'Q2 Financial Review', speaker: 'CFO — Sandra Kim', duration: '20 min' },
      { time: '10:30 AM', title: 'Program Updates — FOCI Division', speaker: 'VP Operations — Mark Donovan', duration: '15 min' },
      { time: '10:45 AM', title: 'CMMC Certification Roadmap', speaker: 'CISO — Rachel Torres', duration: '20 min' },
      { time: '11:05 AM', title: 'HR & Benefits Update', speaker: 'CHRO — Linda Marsh', duration: '15 min' },
      { time: '11:20 AM', title: 'Open Q&A', speaker: 'All Executives', duration: '35 min' },
      { time: '11:55 AM', title: 'Closing Remarks', speaker: 'CEO — James Hartley', duration: '5 min' },
    ],
    speakers: [
      { name: 'James Hartley', initials: 'JH', title: 'Chief Executive Officer', bio: '25 years in defense contracting. Former Deputy Program Manager, US Army AMCOM.' },
      { name: 'Sandra Kim', initials: 'SK', title: 'Chief Financial Officer', bio: 'CPA. Previously SVP Finance at L3Harris Technologies.' },
      { name: 'Rachel Torres', initials: 'RT', title: 'Chief Information Security Officer', bio: 'CISSP. Led CMMC Level 2 certification for previous employer. DCSA primary interface.' },
    ],
    tags: ['Executive', 'Quarterly', 'Q&A'],
    published: true,
    featured: true,
    budgetCents: 450000,
    actualCents: 312000,
    attendeeCount: 0,
  },
  {
    id: 'evt_002',
    title: 'CMMC Level 2 Training — All Staff',
    category: 'Training',
    date: '2026-07-22',
    endDate: '2026-07-22',
    startTime: '09:00',
    endTime: '12:00',
    location: 'Conference Center · Room 2B-201',
    virtualLink: 'https://teams.microsoft.com',
    capacity: 80,
    description: 'Mandatory training for all personnel with access to CUI. Covers NIST SP 800-171 Rev 3 requirements, the CUI scoping boundary, acceptable use of AI tools in GCC High, and incident reporting procedures. Attendance tracked for CMMC compliance records.',
    agenda: [
      { time: '9:00 AM', title: 'CMMC Overview & Why It Matters', speaker: 'CISO — Rachel Torres', duration: '30 min' },
      { time: '9:30 AM', title: 'CUI: What It Is and Where It Lives', speaker: 'Compliance Lead — Dan Patel', duration: '30 min' },
      { time: '10:00 AM', title: 'Break', speaker: '', duration: '10 min' },
      { time: '10:10 AM', title: 'Acceptable Use: GCC High & AI Tools', speaker: 'IT Security — Maria Chen', duration: '30 min' },
      { time: '10:40 AM', title: 'Incident Reporting Procedures', speaker: 'Compliance Lead — Dan Patel', duration: '25 min' },
      { time: '11:05 AM', title: 'Knowledge Check & Attestation', speaker: '', duration: '30 min' },
      { time: '11:35 AM', title: 'Q&A', speaker: 'Rachel Torres', duration: '25 min' },
    ],
    speakers: [
      { name: 'Rachel Torres', initials: 'RT', title: 'Chief Information Security Officer', bio: 'CISSP. Leads all CMMC compliance efforts and DCSA engagement.' },
      { name: 'Dan Patel', initials: 'DP', title: 'Compliance Lead', bio: 'NIST SP 800-171 practitioner. Manages the SSP and POA&M program.' },
    ],
    tags: ['Mandatory', 'CMMC', 'Compliance', 'CUI'],
    published: true,
    featured: false,
    budgetCents: 120000,
    actualCents: 85000,
    attendeeCount: 0,
  },
  {
    id: 'evt_003',
    title: 'New Employee Orientation — July Cohort',
    category: 'HR',
    date: '2026-07-08',
    endDate: '2026-07-08',
    startTime: '08:30',
    endTime: '17:00',
    location: 'HR Suite · Building B · Room B-112',
    virtualLink: '',
    capacity: 20,
    description: 'Welcome to Acme Defense Corp! This full-day orientation introduces new employees to our mission, culture, benefits, security protocols, IT onboarding, and facilities. Lunch provided. Bring government-issued ID for badge issuance.',
    agenda: [
      { time: '8:30 AM', title: 'Welcome & Introductions', speaker: 'CHRO — Linda Marsh', duration: '30 min' },
      { time: '9:00 AM', title: 'Company Mission, History & Culture', speaker: 'CEO — James Hartley', duration: '45 min' },
      { time: '9:45 AM', title: 'Benefits Overview', speaker: 'HR Team', duration: '45 min' },
      { time: '10:30 AM', title: 'Security & Clearance Briefing', speaker: 'FSO — Thomas Reed', duration: '60 min' },
      { time: '11:30 AM', title: 'Badge Issuance & Facility Tour', speaker: 'Security Team', duration: '30 min' },
      { time: '12:00 PM', title: 'Lunch (provided)', speaker: '', duration: '60 min' },
      { time: '1:00 PM', title: 'IT Onboarding & GCC High Access', speaker: 'IT Helpdesk', duration: '90 min' },
      { time: '2:30 PM', title: 'Compliance & Ethics Overview', speaker: 'General Counsel — Amy Walsh', duration: '45 min' },
      { time: '3:15 PM', title: 'Department Introductions', speaker: 'Department Heads', duration: '90 min' },
      { time: '4:45 PM', title: 'Wrap-Up & Q&A', speaker: 'Linda Marsh', duration: '15 min' },
    ],
    speakers: [
      { name: 'Linda Marsh', initials: 'LM', title: 'Chief Human Resources Officer', bio: 'PHR. 18 years in defense contractor HR. Manages all onboarding and talent programs.' },
      { name: 'Thomas Reed', initials: 'TR', title: 'Facility Security Officer', bio: 'FSO certified. Manages all facility and personnel clearance actions.' },
    ],
    tags: ['HR', 'Onboarding', 'New Hire'],
    published: true,
    featured: false,
    budgetCents: 85000,
    actualCents: 91500,
    attendeeCount: 0,
  },
  {
    id: 'evt_004',
    title: 'Summer All-Hands Picnic',
    category: 'Social',
    date: '2026-08-07',
    endDate: '2026-08-07',
    startTime: '11:00',
    endTime: '14:00',
    location: 'Acme Campus Green · Outdoor Pavilion',
    virtualLink: '',
    capacity: 400,
    description: 'Annual summer picnic for all employees and their families. Food trucks, lawn games, raffle prizes, and live music. Employee appreciation awards will be announced. Kids welcome — activities planned for all ages.',
    agenda: [
      { time: '11:00 AM', title: 'Pavilion Opens · Food Trucks & Activities', speaker: '', duration: '60 min' },
      { time: '12:00 PM', title: 'Employee Appreciation Awards', speaker: 'CEO — James Hartley', duration: '30 min' },
      { time: '12:30 PM', title: 'Raffle Prize Drawing', speaker: 'HR Team', duration: '15 min' },
      { time: '12:45 PM', title: 'Open Social Time', speaker: '', duration: '75 min' },
    ],
    speakers: [],
    tags: ['Social', 'Family', 'Annual'],
    published: true,
    featured: false,
    budgetCents: 750000,
    actualCents: 680000,
    attendeeCount: 0,
  },
  {
    id: 'evt_005',
    title: 'FOCI Compliance Update Briefing',
    category: 'Briefing',
    date: '2026-06-10',
    endDate: '2026-06-10',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Executive Conference Room · EX-401',
    virtualLink: 'https://teams.microsoft.com',
    capacity: 30,
    description: 'Management-level briefing on the May 2026 DFARS FOCI rule (Section 847 implementation). Covers applicability to current contract portfolio, SF 328 filing obligations, and the 90-day mitigation clock. DCSA engagement strategy will be discussed.',
    agenda: [
      { time: '2:00 PM', title: 'Rule Overview: What Changed in May 2026', speaker: 'General Counsel — Amy Walsh', duration: '20 min' },
      { time: '2:20 PM', title: 'Contract Portfolio Review', speaker: 'VP Operations — Mark Donovan', duration: '20 min' },
      { time: '2:40 PM', title: 'DCSA Engagement Plan', speaker: 'FSO — Thomas Reed', duration: '20 min' },
      { time: '3:00 PM', title: 'Discussion & Next Steps', speaker: 'All', duration: '30 min' },
    ],
    speakers: [
      { name: 'Amy Walsh', initials: 'AW', title: 'General Counsel', bio: 'J.D., Georgetown. Specializes in government contracts, FOCI compliance, and export controls.' },
    ],
    tags: ['FOCI', 'Compliance', 'Management'],
    published: false,
    featured: false,
    budgetCents: 0,
    actualCents: 0,
    attendeeCount: 0,
  },
];

const SEED_REGISTRATIONS = [
  { id: 'reg_001', eventId: 'evt_001', name: 'Michael Chen',    email: 'mchen@acme-defense.com',    dept: 'Engineering',   attendance: 'in-person', status: 'confirmed', registeredAt: '2026-06-20T10:14:00' },
  { id: 'reg_002', eventId: 'evt_001', name: 'Sarah Johnson',   email: 'sjohnson@acme-defense.com', dept: 'Contracts',     attendance: 'virtual',   status: 'confirmed', registeredAt: '2026-06-21T09:02:00' },
  { id: 'reg_003', eventId: 'evt_001', name: 'David Williams',  email: 'dwilliams@acme-defense.com',dept: 'IT Security',   attendance: 'in-person', status: 'confirmed', registeredAt: '2026-06-21T11:30:00' },
  { id: 'reg_004', eventId: 'evt_001', name: 'Jennifer Park',   email: 'jpark@acme-defense.com',    dept: 'Finance',       attendance: 'in-person', status: 'confirmed', registeredAt: '2026-06-22T08:45:00' },
  { id: 'reg_005', eventId: 'evt_001', name: 'Robert Martinez', email: 'rmartinez@acme-defense.com',dept: 'Program Mgmt',  attendance: 'virtual',   status: 'confirmed', registeredAt: '2026-06-22T14:20:00' },
  { id: 'reg_006', eventId: 'evt_001', name: 'Emily Thompson',  email: 'ethompson@acme-defense.com',dept: 'HR',            attendance: 'in-person', status: 'confirmed', registeredAt: '2026-06-23T10:05:00' },
  { id: 'reg_007', eventId: 'evt_001', name: 'James Rodriguez', email: 'jrodriguez@acme-defense.com',dept:'Ops',           attendance: 'in-person', status: 'confirmed', registeredAt: '2026-06-24T13:00:00' },
  { id: 'reg_008', eventId: 'evt_002', name: 'Michael Chen',    email: 'mchen@acme-defense.com',    dept: 'Engineering',   attendance: 'in-person', status: 'confirmed', registeredAt: '2026-06-25T09:00:00' },
  { id: 'reg_009', eventId: 'evt_002', name: 'David Williams',  email: 'dwilliams@acme-defense.com',dept: 'IT Security',   attendance: 'in-person', status: 'confirmed', registeredAt: '2026-06-25T09:15:00' },
  { id: 'reg_010', eventId: 'evt_002', name: 'Anna Lee',        email: 'alee@acme-defense.com',     dept: 'Contracts',     attendance: 'in-person', status: 'confirmed', registeredAt: '2026-06-26T10:30:00' },
  { id: 'reg_011', eventId: 'evt_003', name: 'Tyler Grant',     email: 'tgrant@acme-defense.com',   dept: 'Engineering',   attendance: 'in-person', status: 'confirmed', registeredAt: '2026-06-28T08:00:00' },
  { id: 'reg_012', eventId: 'evt_003', name: 'Priya Nair',      email: 'pnair@acme-defense.com',    dept: 'Finance',       attendance: 'in-person', status: 'confirmed', registeredAt: '2026-06-28T08:05:00' },
  { id: 'reg_013', eventId: 'evt_004', name: 'Sarah Johnson',   email: 'sjohnson@acme-defense.com', dept: 'Contracts',     attendance: 'in-person', status: 'confirmed', registeredAt: '2026-07-01T11:00:00' },
  { id: 'reg_014', eventId: 'evt_004', name: 'Jennifer Park',   email: 'jpark@acme-defense.com',    dept: 'Finance',       attendance: 'in-person', status: 'confirmed', registeredAt: '2026-07-01T11:05:00' },
  { id: 'reg_015', eventId: 'evt_004', name: 'Robert Martinez', email: 'rmartinez@acme-defense.com',dept: 'Program Mgmt',  attendance: 'in-person', status: 'confirmed', registeredAt: '2026-07-01T11:10:00' },
];

const SEED_CHECKINS = [
  { id: 'ci_001', eventId: 'evt_003', registrationId: 'reg_011', name: 'Tyler Grant',  checkedInAt: '2026-07-08T08:22:00', method: 'qr' },
  { id: 'ci_002', eventId: 'evt_003', registrationId: 'reg_012', name: 'Priya Nair',   checkedInAt: '2026-07-08T08:31:00', method: 'manual' },
];

const SEED_QA = [
  { id: 'qa_001', eventId: 'evt_001', question: 'What is the timeline for the CMMC Level 2 certification?', submittedBy: 'Anonymous', upvotes: 12, answered: false, submittedAt: '2026-06-21T10:00:00' },
  { id: 'qa_002', eventId: 'evt_001', question: 'Will the town hall be recorded and available on SharePoint after?', submittedBy: 'M. Chen', upvotes: 8, answered: true, answer: 'Yes — the recording will be posted to the All-Hands SharePoint site within 24 hours.', submittedAt: '2026-06-22T14:30:00' },
  { id: 'qa_003', eventId: 'evt_001', question: 'Are there any changes to the remote work policy coming in Q3?', submittedBy: 'Anonymous', upvotes: 21, answered: false, submittedAt: '2026-06-23T09:15:00' },
  { id: 'qa_004', eventId: 'evt_001', question: 'What is the status of the parking structure renovation?', submittedBy: 'T. Grant', upvotes: 5, answered: false, submittedAt: '2026-06-24T11:00:00' },
  { id: 'qa_005', eventId: 'evt_002', question: 'Does the CUI handling policy apply to personal devices used for work?', submittedBy: 'Anonymous', upvotes: 9, answered: true, answer: 'Yes. CUI may never be accessed, stored, or transmitted on personal devices. Only ADC-issued GCC High connected devices.', submittedAt: '2026-06-25T10:00:00' },
];

const SEED_POLLS = [
  {
    id: 'poll_001',
    eventId: 'evt_001',
    question: 'Which topic are you most interested in hearing about today?',
    options: [
      { id: 'opt_a', label: 'CMMC Certification Progress', votes: 34 },
      { id: 'opt_b', label: 'Q2 Financial Results',        votes: 18 },
      { id: 'opt_c', label: 'New Benefits & HR Updates',   votes: 22 },
      { id: 'opt_d', label: 'Open Q&A with Leadership',    votes: 41 },
    ],
    active: true,
    myVote: null,
  },
];

const SEED_NEWS = [
  {
    id: 'news_001',
    title: 'Acme Awarded $47M IDIQ Contract Extension',
    category: 'Business',
    excerpt: 'The DoD IDIQ ceiling has been extended through FY2028, securing continued work across our FOCI and systems integration divisions.',
    date: '2026-06-18',
    author: 'Corporate Communications',
    readTime: '2 min',
    emoji: '🏆',
    bgColor: '#dbeafe',
    pinned: true,
  },
  {
    id: 'news_002',
    title: 'CMMC Level 2 Assessment Scheduled for September',
    category: 'Compliance',
    excerpt: 'Our C3PAO assessment is confirmed for the week of September 15. All-staff readiness training begins July 22 — attendance is mandatory.',
    date: '2026-06-15',
    author: 'CISO — Rachel Torres',
    readTime: '3 min',
    emoji: '🔒',
    bgColor: '#dcfce7',
    pinned: true,
  },
  {
    id: 'news_003',
    title: 'New GCC High AI Assistant Now Available',
    category: 'Technology',
    excerpt: 'The enterprise AI assistant (Azure OpenAI + RAG) is live in GCC High. Access via Teams or the ADC intranet. CUI-compliant by design.',
    date: '2026-06-10',
    author: 'IT — Maria Chen',
    readTime: '4 min',
    emoji: '🤖',
    bgColor: '#f0e6ff',
    pinned: false,
  },
  {
    id: 'news_004',
    title: 'Updated Telework Policy Effective July 1',
    category: 'HR',
    excerpt: 'The revised telework policy allows up to 3 days remote per week for non-clearance-required roles. Review the full policy on SharePoint.',
    date: '2026-06-05',
    author: 'CHRO — Linda Marsh',
    readTime: '2 min',
    emoji: '🏠',
    bgColor: '#fff7ed',
    pinned: false,
  },
  {
    id: 'news_005',
    title: 'Employee of the Quarter — Q2 2026',
    category: 'Recognition',
    excerpt: 'Congratulations to Maria Chen (IT) for leading the GCC High AI deployment under CMMC scope — on time and within budget.',
    date: '2026-06-01',
    author: 'HR Team',
    readTime: '1 min',
    emoji: '⭐',
    bgColor: '#fef3c7',
    pinned: false,
  },
  {
    id: 'news_006',
    title: 'Section 847 DFARS Rule: What You Need to Know',
    category: 'Compliance',
    excerpt: 'The May 2026 FOCI rule is now in effect. If your contracts include unclassified work over $5M, read this briefing from General Counsel.',
    date: '2026-05-28',
    author: 'General Counsel — Amy Walsh',
    readTime: '5 min',
    emoji: '📋',
    bgColor: '#fde8e8',
    pinned: false,
  },
];

const SEED_BUDGET = {
  annualBudgetCents: 25000000,
  fy: '2026',
  fiscalYear: 'FY2026',
  deptName: 'Corporate Events & Communications',
  budgetOwner: 'Jennifer Park, Finance Director',
  categories: [
    { id: 'cat_01', name: 'Events & Conferences',          allocatedCents: 6500000, spentCents: 2416500, color: '#0078d4' },
    { id: 'cat_02', name: 'Training & Development',        allocatedCents: 4200000, spentCents: 2100000, color: '#008272' },
    { id: 'cat_03', name: 'Communications & Media',        allocatedCents: 3000000, spentCents: 1450000, color: '#5c2d91' },
    { id: 'cat_04', name: 'Technology & Platforms',        allocatedCents: 5000000, spentCents: 3200000, color: '#da6500' },
    { id: 'cat_05', name: 'Recognition & Social',          allocatedCents: 2800000, spentCents: 1900000, color: '#107c10' },
    { id: 'cat_06', name: 'Travel & Hospitality',          allocatedCents: 3500000, spentCents: 2050000, color: '#a4262c' },
  ],
  lineItems: [
    { id: 'li_01', date: '2026-04-05', description: 'Q1 All-Hands — AV production & catering',    category: 'Events & Conferences',   eventId: null,      amountCents: 380000,  vendor: 'Pinnacle AV',              status: 'paid' },
    { id: 'li_02', date: '2026-04-12', description: 'CMMC Training — LMS licensing Q1',            category: 'Training & Development', eventId: null,      amountCents: 520000,  vendor: 'ComplianceTrack',          status: 'paid' },
    { id: 'li_03', date: '2026-05-01', description: 'Intranet SharePoint customization',           category: 'Technology & Platforms', eventId: null,      amountCents: 1200000, vendor: 'ADC IT',                   status: 'paid' },
    { id: 'li_04', date: '2026-05-14', description: 'Employee Appreciation Gift Cards Q1',         category: 'Recognition & Social',   eventId: null,      amountCents: 220000,  vendor: 'Giftly',                   status: 'paid' },
    { id: 'li_05', date: '2026-05-20', description: 'FOCI Compliance Briefing — room/catering',    category: 'Events & Conferences',   eventId: 'evt_005', amountCents: 0,       vendor: 'Internal',                 status: 'projected' },
    { id: 'li_06', date: '2026-06-01', description: 'Azure OpenAI GCC High deployment (IT)',       category: 'Technology & Platforms', eventId: null,      amountCents: 2000000, vendor: 'Microsoft / IT',           status: 'paid' },
    { id: 'li_07', date: '2026-06-10', description: 'New Hire Orientation July — materials',       category: 'Events & Conferences',   eventId: 'evt_003', amountCents: 91500,   vendor: 'ADC HR',                   status: 'paid' },
    { id: 'li_08', date: '2026-07-08', description: 'Q2 Town Hall — venue, AV, catering',          category: 'Events & Conferences',   eventId: 'evt_001', amountCents: 312000,  vendor: 'Pinnacle AV / Catering',   status: 'committed' },
    { id: 'li_09', date: '2026-07-22', description: 'CMMC Training July — room & materials',       category: 'Training & Development', eventId: 'evt_002', amountCents: 85000,   vendor: 'Internal',                 status: 'committed' },
    { id: 'li_10', date: '2026-08-07', description: 'Summer Picnic — food trucks, rentals, decor', category: 'Events & Conferences',   eventId: 'evt_004', amountCents: 680000,  vendor: 'Various',                  status: 'committed' },
    { id: 'li_11', date: '2026-09-01', description: 'CMMC Assessment Prep — consultant fees',      category: 'Training & Development', eventId: null,      amountCents: 850000,  vendor: 'Fulcrum Advisory',         status: 'projected' },
    { id: 'li_12', date: '2026-10-01', description: 'Q3 All-Hands Town Hall (projected)',          category: 'Events & Conferences',   eventId: null,      amountCents: 380000,  vendor: 'TBD',                      status: 'projected' },
    { id: 'li_13', date: '2026-11-01', description: 'Employee Recognition Banquet',                category: 'Recognition & Social',   eventId: null,      amountCents: 450000,  vendor: 'TBD',                      status: 'projected' },
    { id: 'li_14', date: '2026-06-15', description: 'Video production — CMMC awareness series',    category: 'Communications & Media', eventId: null,      amountCents: 650000,  vendor: 'Summit Studios',           status: 'paid' },
    { id: 'li_15', date: '2026-05-30', description: 'Travel — leadership offsite Q2',              category: 'Travel & Hospitality',   eventId: null,      amountCents: 1200000, vendor: 'Various',                  status: 'paid' },
  ],
};

// Auto-seed on load
if (typeof window !== 'undefined') {
  DB.seedIfEmpty();
}
